import { supabase } from "@/lib/supabaseClient";
import type { UserBookWithInfo } from "@/shared/types/db";
import type { UpdateUserBookPatch } from "@/features/books/lib/types";

export async function fetchUserBookDetail(userBookId: string) {
  const { data, error } = await supabase
    .from("user_books")
    .select(`*,book:books(*)`)
    .eq("id", userBookId)
    .single();

  if (error) throw error;

  return data as unknown as UserBookWithInfo;
}

export async function updateUserBook(
  userBookId: string,
  patch: UpdateUserBookPatch,
) {
  const { data, error } = await supabase
    .from("user_books")
    .update(patch)
    .eq("id", userBookId)
    .select(`*, book:books(*)`)
    .single();

  if (error) throw error;

  return data as unknown as UserBookWithInfo;
}
