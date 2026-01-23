import { supabase } from "@/lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";

export async function getProfileNickname(
  userId: string,
): Promise<{ nickname: string | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { nickname: null, error };

  return { nickname: data?.nickname ?? null, error: null };
}

export async function upsertProfileNickname(
  userId: string,
  nickname: string,
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, nickname }, { onConflict: "user_id" });

  return { error };
}
