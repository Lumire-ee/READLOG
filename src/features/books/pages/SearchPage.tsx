import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchDropdownPanel from "../components/SearchDropdownPanel";
import SearchResultList from "../components/SearchResultList";
import { useBookStore } from "../store/useBookSearchStore";
import type { SearchBook } from "../lib/types";

export default function SearchPage() {
  const [open, setOpen] = useState(false);
  const [hoveredBook, setHoveredBook] = useState<SearchBook | null>(null);

  const { query, setQuery, search, books } = useBookStore();
  const activeBook = hoveredBook ?? books[0] ?? null;

  return (
    <div className="min-h-screen bg-gray-6 p-10">
      <div className="relative">
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
          {activeBook && (
            <div>
              <img src={activeBook.image ?? ""} alt={activeBook.title} />
              <div>{activeBook.title}</div>
              <div>{activeBook.author}</div>
              <div>{activeBook.description}</div>
            </div>
          )}
        </SearchDropdownPanel>
      </div>
    </div>
  );
}
