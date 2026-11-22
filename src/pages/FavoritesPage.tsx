
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";
import { getFavorites, removeFavorite } from "../services/favorites";
import type { Book } from "../types/book";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      setFavorites(await getFavorites());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar favoritos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [user?.id]);

  async function remove(book: Book) {
    try {
      await removeFavorite(book.id);

      setFavorites((current) =>
        current.filter((item) => item.id !== book.id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover favorito.");
    }
  }

  return (
    <section className="results-section favorites-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SUA COLEÇÃO</p>
          <h1>Meus favoritos</h1>
        </div>

        <span className="result-count">{favorites.length} livros</span>
      </div>

      {loading && <p className="message">Carregando favoritos...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p className="message">
          Você ainda não favoritou nenhum livro. Explore o catálogo para começar.
        </p>
      )}

      <div className="book-grid">
        {favorites.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            favorite
            onToggleFavorite={remove}
          />
        ))}
      </div>
    </section>
  );
}
