import type { SearchBook } from "../lib/types";
import { fetchJson } from "@/shared/utils/fetchJson";
import { normalizeCompactText, normalizeText } from "../lib/normalize";
import { parseNaverIsbn } from "../lib/isbn";
import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";
import { stripHtml } from "../lib/normalize";

interface NaverBookItem {
  title: string;
  author: string;
  image: string;
  description?: string;
  publisher: string;
  isbn?: string;
}

/**
 * 네이버 책 검색 API를 호출합니다.
 * @param query 검색어
 * @returns 검색된 책 목록
 */
export async function searchNaverBooks(query: string): Promise<SearchBook[]> {
  const normalizedQuery = normalizeText(query);
  const compactQuery = normalizeCompactText(query);
  if (!normalizedQuery) return [];

  try {
    const url = new URL("/api/books", API_BASE_URL);
    url.searchParams.set("query", query);

    const data = await fetchJson<{ items?: NaverBookItem[] }>(
      url,
      undefined,
      "Naver API",
    );

    return (
      data.items
        ?.filter((item) => {
          const normalizedTitle = normalizeText(item.title);
          const compactTitle = normalizeCompactText(item.title);

          return (
            normalizedTitle.includes(normalizedQuery) ||
            compactTitle.includes(compactQuery)
          );
        })
        .map((item) => ({
          title: stripHtml(item.title),
          author: item.author,
          image: item.image,
          discription: item.description ?? undefined,
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
