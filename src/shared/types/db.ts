export interface Book {
  id: string;
  isbn: string | null;
  title: string;
  author: string;
  thumbnail: string | null;
  publisher: string | null;
  page_count: number | null;
  created_at: string;
}

export type BookStatus = "to_read" | "reading" | "completed" | "quit";

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: BookStatus;

  start_date: string | null;
  end_date: string | null;
  current_page: number;
  rating: number | null;

  notes_md: string | null;
  created_at: string;
  page_count_override: number | null;
}

export interface ReadingStat {
  id: string;
  user_id: string;
  book_id: string;

  date: string;
  pages_read: number;

  created_at: string;
}

export interface Profile {
  user_id: string;
  nickname: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_book_id: string;
  type: string;
  content: string;
  created_at: string;
}

export interface UserBookWithInfo extends UserBook {
  book: Book;
}
