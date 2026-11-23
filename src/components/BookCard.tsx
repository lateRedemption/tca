
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { Book } from "../types/book";

export default function BookCard({
  book,
  favorite,
  onToggleFavorite,
  children,
}: {
  book: Book;
  favorite?: boolean;
  onToggleFavorite?: (book: Book) => void;
  children?: ReactNode;
}) {
  return (
    <article className="book-card">
      <Link to={`/livro/${encodeURIComponent(book.id)}`} className="cover-link">
        <div className="book-cover">
          {book.thumbnail ? (
            <img src={book.thumbnail} alt={`Capa de ${book.title}`} />
          ) : (
            <div className="no-cover">Sem capa</div>
          )}
        </div>
      </Link>

      <div className="book-card-content">
        <Link
          to={`/livro/${encodeURIComponent(book.id)}`}
          className="book-title"
        >
          {book.title}
        </Link>

        <p className="book-author">{book.authors.join(", ")}</p>

        {onToggleFavorite && (
          <button
            className={`favorite-button ${favorite ? "is-favorite" : ""}`}
            onClick={() => onToggleFavorite(book)}
          >
            {favorite ? "♥ Favoritado" : "♡ Favoritar"}
          </button>
        )}

        {children}
      </div>
    </article>
  );
}
