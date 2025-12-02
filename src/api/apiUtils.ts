export type BookSource = "naver" | "google";

export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

export function normalizeText(value: string | undefined | null): string {
  if (!value) return "";
  return stripHtml(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function normalizeIsbn(isbn?: string | null): string | undefined {
  if (!isbn) return undefined;
  const cleaned = isbn.replace(/[\s-]+/g, "").trim();
  return cleaned || undefined;
}

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:5000";

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  context?: string
): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`${context ?? "Request"} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
