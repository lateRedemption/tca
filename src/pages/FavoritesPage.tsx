
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";
import {
  getFavorites,
  removeFavorite,
  updateFavoriteNotes,
} from "../services/favorites";
import type { Book, FavoriteRow } from "../types/book";

export default function FavoritesPage() {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      setFavorites(await getFavorites());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar favoritos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [user?.id]);

  async function remove(favorite: FavoriteRow) {
    try {
      await removeFavorite(favorite.google_books_id);

      setFavorites((current) =>
        current.filter((item) => item.id !== favorite.id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao remover favorito."
      );
    }
  }

  function startEditing(favorite: FavoriteRow) {
    setEditingId(favorite.id);
    setNotesDraft(favorite.notes ?? "");
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setNotesDraft("");
  }

  async function saveNotes(favorite: FavoriteRow) {
    setSavingId(favorite.id);
    setError("");

    try {
      const notes = notesDraft.trim() === "" ? null : notesDraft;

      await updateFavoriteNotes(favorite.google_books_id, notes);

      setFavorites((current) =>
        current.map((item) =>
          item.id === favorite.id
            ? { ...item, notes }
            : item
        )
      );

      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar observação."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="results-section favorites-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SUA COLEÇÃO</p>
          <h1>Meus favoritos</h1>
        </div>

        <span className="result-count">
          {favorites.length} livros
        </span>
      </div>

      {loading && (
        <p className="message">Carregando favoritos...</p>
      )}

      {error && <p className="error">{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p className="message">
          Você ainda não favoritou nenhum livro. Explore o catálogo para começar.
        </p>
      )}

      <div className="book-grid">
        {favorites.map((favorite) => {
          const book: Book = {
            id: favorite.google_books_id,
            title: favorite.title,
            authors: favorite.authors,
            thumbnail: favorite.thumbnail ?? undefined,
            publishedDate: favorite.published_date ?? undefined,
          };

          const isEditing = editingId === favorite.id;
          const isSaving = savingId === favorite.id;

          return (
            <BookCard
              key={favorite.id}
              book={book}
              favorite
              onToggleFavorite={() => remove(favorite)}
            >
              <div className="favorite-notes">
                <h3>Minhas observações</h3>

                {isEditing ? (
                  <>
                    <textarea
                      value={notesDraft}
                      onChange={(event) =>
                        setNotesDraft(event.target.value)
                      }
                      placeholder="Escreva suas observações sobre este livro..."
                      rows={4}
                    />

                    <div className="notes-actions">
                      <button
                        onClick={() => saveNotes(favorite)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Salvando..." : "Salvar"}
                      </button>

                      <button
                        onClick={cancelEditing}
                        disabled={isSaving}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      {favorite.notes || "Nenhuma observação adicionada."}
                    </p>

                    <button
                      onClick={() => startEditing(favorite)}
                    >
                      {favorite.notes
                        ? "Editar observação"
                        : "Adicionar observação"}
                    </button>
                  </>
                )}
              </div>
            </BookCard>
          );
        })}
      </div>
    </section>
  );
}
