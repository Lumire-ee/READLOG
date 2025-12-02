import type { Book } from "./combinedBooks";
import {
  API_BASE_URL,
  fetchJson,
  normalizeIsbn,
  normalizeText,
  stripHtml,
} from "./apiUtils";

interface NaverBookItem {
  title: string;
  author: string;
  image: string;
  publisher: string;
  isbn?: string;
}

function parseNaverIsbn(isbn?: string): string | undefined {
  if (!isbn) return undefined;

  const normalizedList = isbn
    .split(/\s+/)
    .map((value) => normalizeIsbn(value))
    .filter((value): value is string => Boolean(value));

  const isbn13 = normalizedList.find((code) => code.length === 13);
  return isbn13 ?? normalizedList[0];
}

/**
 * 네이버 책 검색 API를 호출합니다.
 * @param query 검색어
 * @returns 검색된 책 목록
 */
export async function searchNaverBooks(query: string): Promise<Book[]> {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  try {
    const url = new URL("/api/books", API_BASE_URL);
    url.searchParams.set("query", query);

    const data = await fetchJson<{ items?: NaverBookItem[] }>(
      url,
      undefined,
      "Naver API"
    );

    return (
      data.items
        ?.filter((item) => normalizeText(item.title).includes(normalizedQuery))
        .map((item) => ({
          title: stripHtml(item.title),
          author: item.author,
          image: item.image,
          publisher: item.publisher,
          isbn: parseNaverIsbn(item.isbn),
          source: "naver",
        })) || []
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("네이버 책 검색 중 오류 발생:", error);
    }
    throw error;
  }
}
