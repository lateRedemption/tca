import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import { addFavorite, getFavorites, removeFavorite } from "../services/favorites";
import { searchBooks } from "../services/books";
import type { Book } from "../types/book";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Pesquise um título, autor ou assunto para começar.");
  const [searched, setSearched] = useState(false);

  async function handleSearch(query: string) {
    if (!query) { setMessage("Digite algo para pesquisar."); return; }
    setLoading(true);
    setSearched(true);
    setMessage("");
    try {
      const results = await searchBooks(query);
      setBooks(results);
      setMessage(results.length ? "" : "Nenhum livro encontrado.");
      if (user) {
        const favorites = await getFavorites(user.id);
        setFavoriteIds(favorites.map((item) => item.google_books_id));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado na pesquisa.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(book: Book) {
    if (!user) { navigate("/login"); return; }
    try {
      if (favoriteIds.includes(book.id)) {
        await removeFavorite(user.id, book.id);
        setFavoriteIds((current) => current.filter((id) => id !== book.id));
      } else {
        await addFavorite(user.id, book);
        setFavoriteIds((current) => [...current, book.id]);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível atualizar o favorito.");
    }
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">SUA PRÓXIMA LEITURA COMEÇA AQUI</p>
        <h1>Encontre seu<br /><em>próximo livro.</em></h1>
        <p className="hero-copy">Explore milhões de livros e guarde seus favoritos em uma biblioteca pessoal.</p>
        <SearchBar onSearch={handleSearch} />
      </section>
      <section className="results-section">
        <div className="section-heading">
          <div><p className="eyebrow">{searched ? "RESULTADOS DA PESQUISA" : "DESCUBRA"}</p><h2>{searched ? "Livros encontrados" : "Explore o catálogo"}</h2></div>
          {books.length > 0 && <span className="result-count">{books.length} livros</span>}
        </div>
        {loading && <p className="message">Buscando livros...</p>}
        {!loading && message && <p className="message">{message}</p>}
        <div className="book-grid">
          {books.map((book) => <BookCard key={book.id} book={book} favorite={favoriteIds.includes(book.id)} onToggleFavorite={toggleFavorite} />)}
        </div>
      </section>
    </>
  );
}