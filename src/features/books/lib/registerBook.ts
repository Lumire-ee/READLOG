import { supabase } from "@/lib/supabaseClient";
import type { SearchBook } from "./types";

export async function registerBook(book: SearchBook) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw userError;
  const user = userData.user;
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: upsertedBook, error: bookError } = await supabase
    .from("books")
    .upsert(
      {
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        thumbnail: book.image ?? null,
        publisher: book.publisher ?? null,
        page_count: null,
      },
      { onConflict: "isbn" },
    )
    .select("id")
    .single();

  if (bookError) throw bookError;

  const { error: userBookError } = await supabase.from("user_books").upsert(
    {
      user_id: user.id,
      book_id: upsertedBook.id,
      status: "to_read",
    },
    { onConflict: "user_id, book_id" },
  );

  if (userBookError) throw userBookError;

  return upsertedBook.id;
}
