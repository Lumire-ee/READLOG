import type { SearchBook } from "../lib/types";
import { fetchJson } from "@/shared/utils/fetchJson";
import { normalizeCompactText, normalizeText } from "../lib/normalize";
import { extractIsbn } from "../lib/isbn";

interface GoogleBookItem {
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    industryIdentifiers?: { type: string; identifier: string }[];
    pageCount?: number;
  };
}

/**
 * 구글 책 검색 API를 호출합니다.
 * @param query 검색어
 * @returns 검색된 책 목록
 */
export async function searchGoogleBooks(query: string): Promise<SearchBook[]> {
  const normalizedQuery = normalizeText(query);
  const compactQuery = normalizeCompactText(query);
  if (!normalizedQuery) return [];

  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("구글 API 키 설정이 필요합니다.");
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query,
    )}&key=${apiKey}`;

    const data = await fetchJson<{ items?: GoogleBookItem[] }>(
      url,
      undefined,
      "Google Books API",
    );

    return (
      data.items
        ?.filter((item) => {
          const title = item.volumeInfo.title ?? "";
          const authors = item.volumeInfo.authors?.join(" ") ?? "";
          const searchText = `${title} ${authors}`;

          const normalizedsearchText = normalizeText(searchText);
          const compactsearchText = normalizeCompactText(searchText);

          return (
            normalizedsearchText.includes(normalizedQuery) ||
            compactsearchText.includes(compactQuery)
          );
        })
        .map((item) => ({
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(", ") || "",
          image: item.volumeInfo.imageLinks?.thumbnail || "",
          publisher: item.volumeInfo.publisher || "",
          description: item.volumeInfo.description || undefined,
          isbn: extractIsbn(item.volumeInfo.industryIdentifiers),
          source: "google",
          pageCount: item.volumeInfo.pageCount || undefined,
        })) || []
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("구글 책 검색 중 오류 발생:", error);
    }
    throw error;
  }
}
