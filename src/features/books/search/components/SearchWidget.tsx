import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SearchBook } from "../lib/types";
import { useBookStore } from "../store/useBookSearchStore";
import SearchBar from "./SearchBar";
import SearchDropdownSkeleton from "./SearchDropdownSkeleton";
import SearchDropdownPanel from "./SearchDropdownPanel";
import SearchResultList from "./SearchResultList";
import SearchResultPreview from "./SearchResultPreview";

const PAGE_SIZE = 5;

type Props = {
  onSelectBook?: (book: SearchBook) => void;
  onRegister?: (book: SearchBook) => Promise<void>;
  className?: string;
};

export default function SearchWidget({
  onSelectBook,
  onRegister,
  className,
}: Props) {
  const { errorToast } = useToast();
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hoveredBook, setHoveredBook] = useState<SearchBook | null>(null);

  const { query, setQuery, search, books, loading, error } = useBookStore();
  const hasResults = books.length > 0;
  const activeBook = hoveredBook ?? books[0] ?? null;
  const isViewingSubmittedQuery = query.trim() === lastSubmittedQuery;
  const showErrorState =
    hasSubmitted &&
    isViewingSubmittedQuery &&
    !loading &&
    Boolean(error) &&
    !hasResults;
  const showEmptyState =
    hasSubmitted &&
    isViewingSubmittedQuery &&
    !loading &&
    !error &&
    !hasResults &&
    lastSubmittedQuery.length > 0;
  const shouldShowDropdown =
    open && (loading || hasResults || showErrorState || showEmptyState);

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
    const trimmedQuery = query.trim();
    setLastSubmittedQuery(trimmedQuery);
    setHasSubmitted(true);
    search();
    setPageIndex(0);
    setHoveredBook(null);
    setOpen(true);
  }

  async function handleSelect(book: SearchBook) {
    setOpen(false);
    setHoveredBook(null);

    try {
      await onRegister?.(book);
      onSelectBook?.(book);
    } catch {
      errorToast("책 추가에 실패했습니다. 잠시 후 다시 시도해보세요.");
    }
  }

  return (
    <div
      ref={containerRef}
      className={className ?? "relative w-full max-w-full min-w-[300px]"}
    >
      <SearchBar
        query={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        onFocus={() => setOpen(true)}
      />

      {shouldShowDropdown ? (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onMouseDown={() => setOpen(false)}
        />
      ) : null}

      <SearchDropdownPanel open={shouldShowDropdown}>
        {loading ? (
          <SearchDropdownSkeleton rows={PAGE_SIZE} />
        ) : hasResults ? (
          <>
            {/* Left / List, Pagination */}
            <div className="flex w-full min-w-0 flex-col md:w-[55%]">
              <div className="flex-1 overflow-y-auto md:overflow-hidden md:pr-2">
                <SearchResultList
                  results={visibleBooks}
                  onHover={setHoveredBook}
                  onSelect={handleSelect}
                />
              </div>

              <div className="flex items-center justify-center">
                {totalPages > 1 && (
                  <div className="flex items-center">
                    <Button
                      className="cursor-pointer"
                      disabled={pageIndex === 0}
                      onClick={() => setPageIndex((p) => p - 1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <span className="typo-body-sm flex">
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
            <div className="hidden w-[45%] md:block">
              <SearchResultPreview book={activeBook} />
            </div>
          </>
        ) : (
          <div className="flex w-full items-center justify-center py-10">
            <p className="typo-label-md text-text-secondary text-center whitespace-pre-line">
              {showErrorState
                ? error
                : "검색 결과가 없습니다.\n다른 키워드로 다시 시도해보세요."}
            </p>
          </div>
        )}
      </SearchDropdownPanel>
    </div>
  );
}
