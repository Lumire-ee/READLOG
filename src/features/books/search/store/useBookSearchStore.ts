import { create } from "zustand";
import type { SearchBook } from "../lib/types";
import { searchCombinedBooks } from "../api/searchCombinedBooks";

interface BookState {
  query: string;
  includeVariants: boolean;
  books: SearchBook[];
  loading: boolean;
  error?: string;
  setQuery: (value: string) => void;
  setIncludeVariants: (value: boolean) => void;
  search: (override?: {
    query?: string;
    includeVariants?: boolean;
  }) => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  query: "",
  includeVariants: false,
  books: [],
  loading: false,
  error: undefined,
  setQuery: (value) => set({ query: value }),
  setIncludeVariants: (value) => set({ includeVariants: value }),
  search: async (override) => {
    const currentQuery = override?.query ?? get().query;
    const includeVariants = override?.includeVariants ?? get().includeVariants;

    if (!currentQuery.trim()) {
      set({
        error: "찾으시는 책이 무엇인가요?\n제목이나 저자를 입력해보세요",
        books: [],
      });
      return;
    }

    set({ loading: true, error: undefined });
    try {
      const results = await searchCombinedBooks(currentQuery, {
        includeVariants,
      });
      set({ books: results });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "검색 중 오류가 발생했습니다.";
      set({ error: message, books: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
