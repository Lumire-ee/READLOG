import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchDropdownPanel from "../components/SearchDropdownPanel";
import SearchResultList from "../components/SearchResultList";
import { useBookStore } from "../store/useBookSearchStore";
import type { SearchBook } from "../lib/types";
import SearchResultPreview from "../components/SearchResultPreview";

export default function SearchPage() {
  const [open, setOpen] = useState(false);
  const [hoveredBook, setHoveredBook] = useState<SearchBook | null>(null);

  const { query, setQuery, search, books } = useBookStore();
  const activeBook = hoveredBook ?? books[0] ?? null;

  return (
    <div className="min-h-screen p-10">
      <div className="flex justify-center">
        <div className="relative w-[50vw] max-w-xl min-w-[300px]">
          <SearchBar
            query={query}
            onChange={setQuery}
            onSubmit={search}
            onFocus={() => setOpen(true)}
          />

          <SearchDropdownPanel open={open}>
            <SearchResultList
              results={books}
              onHover={(book) => setHoveredBook(book)}
              onSelect={() => {}}
            />
            <SearchResultPreview book={activeBook} />
          </SearchDropdownPanel>
        </div>
      </div>
    </div>
  );
}
