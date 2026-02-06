import type { SearchBook } from "../lib/types";
import type { SearchOptions } from "../lib/types";
import { searchNaverBooks } from "./naverBookApi";
import { searchGoogleBooks } from "./googleBookApi";
import {
  filterLowQuality,
  filterEditionVariants,
  filterForeignEditions,
} from "../lib/filters";
import { mergeBooks } from "../lib/merge";
import { groupByBaseTitle } from "../lib/edition";

export async function searchCombinedBooks(
  query: string,
  options?: SearchOptions,
): Promise<SearchBook[]> {
  if (!query || !query.trim()) {
    throw new Error("Search query is empty.");
  }

  const results = await Promise.allSettled([
    searchNaverBooks(query),
    searchGoogleBooks(query),
  ]);

  const allBooks: SearchBook[] = [];

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
    options?.includeVariants,
  );
  const localized = filterForeignEditions(
    editionFiltered,
    query,
    options?.includeVariants,
  );

  if (options?.includeVariants) {
    return localized;
  }

  return groupByBaseTitle(localized);
}
