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
    googleBookId: row.google_book_id,
    title: row.title,
    authors: row.authors ?? [],
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    publishedDate: row.published_date ?? undefined,
    pageCount: row.page_count ?? undefined,
    categories: row.categories ?? [],
    infoLink: row.info_link ?? undefined,
  };
}

export async function getFavorites(): Promise<Book[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("favorites")
    .select("google_book_id,title,authors,description,image_url,published_date,page_count,categories,info_link,created_at")
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
      google_book_id: book.googleBookId,
      title: book.title,
      authors: book.authors ?? [],
      description: book.description ?? null,
      image_url: book.imageUrl ?? null,
      published_date: book.publishedDate ?? null,
      page_count: book.pageCount ?? null,
      categories: book.categories ?? [],
      info_link: book.infoLink ?? null,
    },
    { onConflict: "user_id,google_book_id" },
  );

  if (error) throw new Error(error.message);
}

export async function removeFavorite(googleBookId: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("google_book_id", googleBookId);

  if (error) throw new Error(error.message);
}
