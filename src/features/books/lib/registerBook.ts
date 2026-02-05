import { supabase } from "@/lib/supabaseClient";
import type { SearchBook } from "./types";

export async function registerBook(book: SearchBook) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase.rpc("add_book_to_user", {
    p_isbn: book.isbn,
    p_title: book.title,
    p_author: book.author,
    p_thumbnail: book.image ?? null,
    p_publisher: book.publisher ?? null,
    p_page_count: book.pageCount ?? null,
  });

  if (error) throw error;

  return data;
}
