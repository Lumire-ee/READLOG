import type { Book } from "./types";
import { isEditionVariant } from "./edition";

export function filterLowQuality(books: ReadonlyArray<Book>): Book[] {
  return books.filter(
    (book) =>
      Boolean(book.title?.trim()) &&
      Boolean(book.author?.trim()) &&
      Boolean(book.publisher?.trim()) &&
      Boolean(book.image?.trim())
  );
}
// google결과에 메타데이터가 부족한 경우가 많음. 대량 필터링될 위험 존재.

export function filterEditionVariants(
  books: ReadonlyArray<Book>,
  includeVariants?: boolean
): Book[] {
  if (includeVariants) return [...books];

  const baseExists = books.some((book) => !isEditionVariant(book.title || ""));
  if (!baseExists) return [...books];

  return books.filter((book) => !isEditionVariant(book.title || ""));
}

export function filterForeignEditions(
  books: ReadonlyArray<Book>,
  query: string,
  includeVariants?: boolean
): Book[] {
  if (includeVariants) return [...books];

  const hasKoreanInQuery = /[가-힣]/.test(query);
  if (!hasKoreanInQuery) return [...books];

  const englishEditionRegex = /(영문판|영어판|english\s*edition|english)/i;
  return books.filter((book) => {
    const title = book.title || "";
    if (englishEditionRegex.test(title)) return false;
    if (/[가-힣]/.test(title)) return true;
    return !englishEditionRegex.test(title);
  });
}
