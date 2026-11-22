import { supabase } from "../lib/supabase";
import type { Book, FavoriteRow } from "../types/book";

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Você precisa estar autenticado para acessar seus favoritos.");
  }

  return data.user.id;
}

function mapFavorite(row: FavoriteRow): Book {
  return {
    id: row.google_books_id,
    title: row.title,
    authors: row.authors ?? [],
    thumbnail: row.thumbnail ?? undefined,
    publishedDate: row.published_date ?? undefined,
  };
}

export async function getFavorites(): Promise<Book[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("favorites")
    .select("id,user_id,google_books_id,title,authors,thumbnail,published_date,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => mapFavorite(row as FavoriteRow));
}

export async function addFavorite(book: Book): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("favorites").upsert(
    {
      user_id: userId,
      google_books_id: book.id,
      title: book.title,
      authors: book.authors,
      thumbnail: book.thumbnail ?? null,
      published_date: book.publishedDate ?? null,
    },
    { onConflict: "user_id,google_books_id" },
  );

  if (error) throw new Error(error.message);
}

export async function removeFavorite(googleBookId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("google_books_id", googleBookId);

  if (error) throw new Error(error.message);
}
