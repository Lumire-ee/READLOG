import { create } from "zustand";
import { searchCombinedBooks, type Book } from "../api/combinedBooks";

interface BookState {
  query: string;
  includeVariants: boolean;
  books: Book[];
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
      set({ error: "검색어를 입력하세요.", books: [] });
      return;
    }

    set({ loading: true, error: undefined });
    try {
      console.log("검색 시작 (store):", {
        query: currentQuery,
        includeVariants,
      });
      const results = await searchCombinedBooks(currentQuery, {
        includeVariants,
      });
      console.log("최종 결과 (store):", results);
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

