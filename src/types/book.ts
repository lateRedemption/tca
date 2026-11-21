export interface Book {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
}

export interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      description?: string;
      imageLinks?: { thumbnail?: string; smallThumbnail?: string };
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
      publisher?: string;
    };
  }>;
}

export interface FavoriteRow {
  id: string;
  user_id: string;
  google_books_id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
  published_date: string | null;
  created_at: string;
}