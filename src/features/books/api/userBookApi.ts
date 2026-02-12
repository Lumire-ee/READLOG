import { supabase } from "@/lib/supabaseClient";
import type { UserBookWithInfo } from "@/shared/types/db";

export async function fetchUserBookDetail(userBookId: string) {
  const { data, error } = await supabase
    .from("user_books")
    .select(`*,book:books(*)`)
    .eq("id", userBookId)
    .single();

  if (error) throw error;

  return data as unknown as UserBookWithInfo;
}
