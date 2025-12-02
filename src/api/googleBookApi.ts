import type { Book } from "./combinedBooks";
import { fetchJson, normalizeIsbn, normalizeText } from "./apiUtils";

interface GoogleBookItem {
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

function extractIsbn(
  identifiers?: { type: string; identifier: string }[]
): string | undefined {
  if (!identifiers?.length) return undefined;

  const isbn13 = identifiers.find((item) => item.type === "ISBN_13");
  const cleanedIsbn13 = normalizeIsbn(isbn13?.identifier);
  if (cleanedIsbn13) return cleanedIsbn13;

  for (const item of identifiers) {
    const cleaned = normalizeIsbn(item.identifier);
    if (cleaned) return cleaned;
  }

  return undefined;
}

/**
 * 구글 책 검색 API를 호출합니다.
 * @param query 검색어
 * @returns 검색된 책 목록
 */
export async function searchGoogleBooks(query: string): Promise<Book[]> {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("구글 API 키 설정이 필요합니다.");
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    const data = await fetchJson<{ items?: GoogleBookItem[] }>(
      url,
      undefined,
      "Google Books API"
    );

    return (
      data.items
        ?.filter((item) =>
          normalizeText(item.volumeInfo.title).includes(normalizedQuery)
        )
        .map((item) => ({
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(", ") || "",
          image: item.volumeInfo.imageLinks?.thumbnail || "",
          publisher: item.volumeInfo.publisher || "",
          isbn: extractIsbn(item.volumeInfo.industryIdentifiers),
          source: "google",
        })) || []
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("구글 책 검색 중 오류 발생:", error);
    }
    throw error;
  }
}
