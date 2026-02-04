import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import SearchDropdownPanel from "./SearchDropdownPanel";
import SearchResultList from "./SearchResultList";
import { useBookStore } from "../store/useBookSearchStore";
import type { SearchBook } from "../lib/types";
import SearchResultPreview from "./SearchResultPreview";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

type Props = {
  onSelectBook?: (book: SearchBook) => void;
  className?: string;
};

export default function SearchWidget({ onSelectBook, className }: Props) {
  const [open, setOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hoveredBook, setHoveredBook] = useState<SearchBook | null>(null);

  const { query, setQuery, search, books } = useBookStore();
  const hasResults = books.length > 0;
  const activeBook = hoveredBook ?? books[0] ?? null;

  const totalPages = Math.ceil(books.length / PAGE_SIZE);
  const visibleBooks = books.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // log
        console.log("click outside");
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleSubmit() {
    // log
    console.log("submit");
    search();
    setPageIndex(0);
    setHoveredBook(null);
    setOpen(true);
  }

  function handleSelect(book: SearchBook) {
    setOpen(false);
    setHoveredBook(null);
    onSelectBook?.(book);
  }

  return (
    <div
      ref={containerRef}
      className={className ?? "relative w-full max-w-xl min-w-[300px]"}
    >
      <SearchBar
        query={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        onFocus={() => setOpen(true)}
      />

      <SearchDropdownPanel open={open && hasResults}>
        {/* Left / List, Pagination */}
        <div className="w-[55%] flex flex-col">
          <div className="flex-1 overflow-hidden pr-2 ">
            <SearchResultList
              results={visibleBooks}
              onHover={setHoveredBook}
              onSelect={handleSelect}
            />
          </div>

          {/* Todo: Pagination 버튼 dropdown전체 기준 중앙정렬 */}
          <div className="flex justify-center items-center">
            {totalPages > 1 && (
              <div className="flex items-center">
                <Button
                  className="cursor-pointer"
                  disabled={pageIndex === 0}
                  onClick={() => setPageIndex((p) => p - 1)}
                >
                  <ChevronLeft />
                </Button>
                <span className="flex typo-body-sm">
                  {pageIndex + 1} - {totalPages}
                </span>
                <Button
                  className="cursor-pointer"
                  disabled={pageIndex === totalPages - 1}
                  onClick={() => setPageIndex((p) => p + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right / Preview */}
        <div className="w-[45%]">
          <SearchResultPreview book={activeBook} />
        </div>
      </SearchDropdownPanel>
    </div>
  );
}
