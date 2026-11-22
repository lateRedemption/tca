import type { Book } from "../types/book";

interface GoogleVolume {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    publisher?: string;
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleVolume[];
}

const API_URL = "https://www.googleapis.com/books/v1/volumes";

function normalizeBook(volume: GoogleVolume): Book {
  const info = volume.volumeInfo ?? {};
  const rawImage = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return {
    id: volume.id,
    title: info.title ?? "Título não informado",
    authors: info.authors ?? ["Autor não informado"],
    description: info.description,
    thumbnail: rawImage?.replace(/^http:/, "https:"),
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    categories: info.categories ?? [],
    publisher: info.publisher,
  };
}

export async function searchBooks(query: string): Promise<Book[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const params = new URLSearchParams({
    q: cleanQuery,
    maxResults: "24",
    printType: "books",
    orderBy: "relevance",
  });

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  if (apiKey) params.set("key", apiKey);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Google Books retornou HTTP ${response.status}.`);
  }

  const data: GoogleBooksResponse = await response.json();
  return (data.items ?? []).map(normalizeBook);
}
