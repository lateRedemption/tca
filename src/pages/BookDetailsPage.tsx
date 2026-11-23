
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookById } from "../services/books";
import type { Book } from "../types/book";

export default function BookDetailsPage() {
  const { id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      setBook(null);
      setError("");
      setLoading(true);

      if (!id) {
        setError("ID do livro não informado.");
        setLoading(false);
        return;
      }

      try {
        const result = await getBookById(id);

        if (!cancelled) {
          setBook(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar livro."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="message">Carregando livro...</p>;
  }

  if (error) {
    return (
      <section className="details-layout">
        <p className="message">{error}</p>
        <Link className="text-link" to="/">
          ← Voltar ao catálogo
        </Link>
      </section>
    );
  }

  if (!book) return null;

  return (
    <section className="details-layout">
      <div className="details-cover">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={`Capa de ${book.title}`} />
        ) : (
          <div className="no-cover">Sem capa</div>
        )}
      </div>

      <div className="details-info">
        <p className="eyebrow">DETALHES DO LIVRO</p>

        <h1>{book.title}</h1>

        <p className="details-author">
          {book.authors.join(", ")}
        </p>

        {book.publisher && (
          <p><strong>Editora:</strong> {book.publisher}</p>
        )}

        {book.publishedDate && (
          <p><strong>Publicado em:</strong> {book.publishedDate}</p>
        )}

        {book.pageCount && (
          <p><strong>Páginas:</strong> {book.pageCount}</p>
        )}

        {book.categories && book.categories.length > 0 && (
          <p>
            <strong>Categorias:</strong> {book.categories.join(", ")}
          </p>
        )}

        <div className="description">
          <h2>Descrição</h2>
          <p>{book.description ?? "Descrição não disponível."}</p>
        </div>

        <Link className="text-link" to="/">
          ← Voltar ao catálogo
        </Link>
      </div>
    </section>
  );
}
