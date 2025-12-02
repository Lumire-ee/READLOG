import { searchNaverBooks } from "./bookApi";
import { searchGoogleBooks } from "./googleBookApi";
import type { BookSource } from "./apiUtils";
import { normalizeIsbn, normalizeText } from "./apiUtils";

export interface Book {
  title: string;
  author: string;
  image: string;
  publisher: string;
  isbn?: string;
  source: BookSource;
}

export interface SearchOptions {
  includeVariants?: boolean;
}

const KEY_SEPARATOR = "::";

const EDITION_KEYWORDS = [
  "개정판",
  "증보판",
  "개정증보판",
  "초판",
  "기념판",
  "주년",
  "리미티드",
  "한정판",
  "스페셜",
  "콜렉터스",
  "collector",
  "limited",
  "special",
  "deluxe",
  "anniversary",
  "세트",
  "전\\d+권",
  "박스세트",
  "box(ed)? set",
  "합본",
  "omnibus",
  "하드커버",
  "hardcover",
  "양장본",
  "페이퍼백",
  "paperback",
  "문고판",
  "mass market",
  "pocket",
  "slipcase",
  "gift edition",
  "illustrated",
  "graphic",
  "movie tie-in",
  "media tie-in",
  "전자책",
  "ebook",
  "kindle",
  "오디오북",
  "audio",
  "bilingual",
  "영문판",
  "영어판",
  "english edition",
  "완역본",
];

function generateBookKey(book: Book): string {
  const normalizedIsbn = normalizeIsbn(book.isbn);
  if (normalizedIsbn) {
    return normalizedIsbn;
  }

  const normalizedTitle = normalizeText(book.title);
  const normalizedAuthor = normalizeText(book.author);
  const normalizedPublisher = normalizeText(book.publisher);
  const normalizedSource = normalizeText(book.source);

  const secondary = normalizedAuthor || normalizedPublisher || normalizedSource;

  if (normalizedTitle && secondary) {
    return `${normalizedTitle}${KEY_SEPARATOR}${secondary}`;
  }

  if (normalizedTitle) {
    return normalizedTitle;
  }

  return `${book.title}${KEY_SEPARATOR}${book.author}`.trim();
}

function qualityScore(book: Book): number {
  let score = 0;
  if (book.isbn?.trim()) score += 5;
  if (book.image?.trim()) score += 2;
  if (book.publisher?.trim()) score += 1;
  if (book.author?.trim()) score += 1;
  return score;
}

function filterLowQuality(books: ReadonlyArray<Book>): Book[] {
  return books.filter(
    (book) =>
      Boolean(book.title?.trim()) &&
      Boolean(book.author?.trim()) &&
      Boolean(book.publisher?.trim()) &&
      Boolean(book.image?.trim())
  );
}

function isEditionVariant(title: string): boolean {
  return EDITION_KEYWORDS.some((kw) => new RegExp(kw, "i").test(title));
}

function filterEditionVariants(
  books: ReadonlyArray<Book>,
  includeVariants?: boolean
): Book[] {
  if (includeVariants) return [...books];

  const baseExists = books.some((book) => !isEditionVariant(book.title || ""));
  if (!baseExists) return [...books];

  return books.filter((book) => !isEditionVariant(book.title || ""));
}

function filterForeignEditions(
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

function stripEditionKeywords(title: string): string {
  let cleaned = title;

  cleaned = cleaned.replace(/\([^)]*\)/g, (segment) => {
    const hasKeyword = EDITION_KEYWORDS.some((kw) =>
      new RegExp(kw, "i").test(segment)
    );
    return hasKeyword ? "" : segment;
  });

  for (const keyword of EDITION_KEYWORDS) {
    cleaned = cleaned.replace(new RegExp(keyword, "ig"), "");
  }

  return cleaned.replace(/\s{2,}/g, " ").trim();
}

function baseTitleKey(book: Book): string {
  const baseTitle = stripEditionKeywords(book.title);
  const normalizedTitle = normalizeText(baseTitle);
  const normalizedAuthor = normalizeText(book.author);
  return [normalizedTitle, normalizedAuthor]
    .filter(Boolean)
    .join(KEY_SEPARATOR);
}

function groupByBaseTitle(books: ReadonlyArray<Book>): Book[] {
  const map = new Map<string, Book[]>();

  for (const book of books) {
    const key = baseTitleKey(book) || generateBookKey(book);
    const list = map.get(key);
    if (!list) {
      map.set(key, [book]);
    } else {
      list.push(book);
    }
  }

  const winners: Book[] = [];
  for (const variants of map.values()) {
    const best = variants.reduce((prev, current) => {
      const diff = qualityScore(current) - qualityScore(prev);
      if (diff === 0) {
        return current.title.length > prev.title.length ? prev : current;
      }
      return diff > 0 ? current : prev;
    });
    winners.push(best);
  }

  return winners;
}

function mergeBooks(books: ReadonlyArray<Book>): Book[] {
  const map = new Map<string, Book>();

  for (const book of books) {
    const key = generateBookKey(book);
    const existing = map.get(key);

    if (!existing) {
      map.set(key, book);
      continue;
    }

    const existingScore = qualityScore(existing);
    const candidateScore = qualityScore(book);

    if (candidateScore > existingScore) {
      map.set(key, book);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const titleComparison = a.title.localeCompare(b.title, undefined, {
      sensitivity: "base",
    });

    if (titleComparison !== 0) return titleComparison;

    return a.author.localeCompare(b.author, undefined, {
      sensitivity: "base",
    });
  });
}

export async function searchCombinedBooks(
  query: string,
  options?: SearchOptions
): Promise<Book[]> {
  if (!query || !query.trim()) {
    throw new Error("Search query is empty.");
  }

  const results = await Promise.allSettled([
    searchNaverBooks(query),
    searchGoogleBooks(query),
  ]);

  const allBooks: Book[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allBooks.push(...result.value);
    } else if (import.meta.env.DEV) {
      console.warn("Book search API call failed", result.reason);
    }
  }

  const merged = mergeBooks(allBooks);
  const qualityFiltered = filterLowQuality(merged);
  const editionFiltered = filterEditionVariants(
    qualityFiltered,
    options?.includeVariants
  );
  const localized = filterForeignEditions(
    editionFiltered,
    query,
    options?.includeVariants
  );

  if (options?.includeVariants) {
    return localized;
  }

  return groupByBaseTitle(localized);
}

