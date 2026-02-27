import { supabase } from "@/lib/supabaseClient";
import type { UserBookWithInfo } from "@/shared/types/db";
import type { UpdateUserBookPatch } from "@/features/books/detail/lib/types";
import { fetchJson } from "@/shared/utils/fetchJson";
import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";

async function getAuthHeaders() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function fetchUserBookDetail(userBookId: string) {
  const headers = await getAuthHeaders();
  const url = new URL(`/api/user-books/${userBookId}`, API_BASE_URL);

  return fetchJson<UserBookWithInfo>(url, { headers }, "Fetch user book detail");
}

export async function updateUserBook(
  userBookId: string,
  patch: UpdateUserBookPatch,
) {
  const headers = await getAuthHeaders();
  const url = new URL(`/api/user-books/${userBookId}`, API_BASE_URL);

  return fetchJson<UserBookWithInfo>(
    url,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    },
    "Update user book",
  );
}

export async function fetchUserBooks(userId: string) {
  const { data, error } = await supabase
    .from("user_books")
    .select(`*, book:books(*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as UserBookWithInfo[];
}

export async function deleteUserBook(userBookId: string) {
  const headers = await getAuthHeaders();
  const url = new URL(`/api/user-books/${userBookId}`, API_BASE_URL);

  await fetchJson<void>(
    url,
    {
      method: "DELETE",
      headers,
    },
    "Delete user book",
  );
}
