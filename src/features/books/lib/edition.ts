import type { SearchBook } from "./types";
import { EDITION_KEYWORDS } from "./editionKeywords";
import { normalizeText } from "./normalize";
import { generateBookKey, qualityScore } from "./merge";

export function isEditionVariant(title: string): boolean {
  return EDITION_KEYWORDS.some((kw) => new RegExp(kw, "i").test(title));
}

function baseTitleKey(book: SearchBook): string {
  const baseTitle = stripEditionKeywords(book.title);
  const normalizedTitle = normalizeText(baseTitle);
  const normalizedAuthor = normalizeText(book.author);
  return [normalizedTitle, normalizedAuthor].filter(Boolean).join("::");
}

export function groupByBaseTitle(
  books: ReadonlyArray<SearchBook>
): SearchBook[] {
  const map = new Map<string, SearchBook[]>();

  for (const book of books) {
    const key = baseTitleKey(book) || generateBookKey(book);
    const list = map.get(key);
    if (!list) {
      map.set(key, [book]);
    } else {
      list.push(book);
    }
  }

  const winners: SearchBook[] = [];

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

export function stripEditionKeywords(title: string): string {
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
