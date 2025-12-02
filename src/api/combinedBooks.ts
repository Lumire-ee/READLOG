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

const KEY_SEPARATOR = "::";

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

export async function searchCombinedBooks(query: string): Promise<Book[]> {
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

  return mergeBooks(allBooks);
}
