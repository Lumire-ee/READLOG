import { supabase } from "@/lib/supabaseClient";
import type { PostgrestError } from "@supabase/supabase-js";
import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";

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

export class DeleteMyAccountError extends Error {
  code: string;
  status: number;

  constructor(code: string, status: number, message: string) {
    super(message);
    this.name = "DeleteMyAccountError";
    this.code = code;
    this.status = status;
  }
}

type DeleteAccountErrorPayload = {
  code?: string;
  error?: string;
};

export async function deleteMyAccount() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    throw new DeleteMyAccountError(
      "invalid_access_token",
      401,
      "로그인이 필요합니다.",
    );
  }

  const url = new URL("/api/account", API_BASE_URL);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) return;

  let payload: DeleteAccountErrorPayload = {};
  try {
    payload = (await response.json()) as DeleteAccountErrorPayload;
  } catch {
    payload = {};
  }

  throw new DeleteMyAccountError(
    payload.code ?? "delete_account_failed",
    response.status,
    payload.error ?? "회원 탈퇴 요청에 실패했습니다. 잠시 후 다시 시도해주세요",
  );
}
