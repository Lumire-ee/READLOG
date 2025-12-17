import type { SearchBook } from "../lib/types";
import SearchResultRow from "./SearchResultRow";

interface SearchResultListProps {
  results: SearchBook[];
  onHover: (book: SearchBook) => void;
  onSelect: (book: SearchBook) => void;
}

export default function SearchResultList({
  results,
  onHover,
  onSelect,
}: SearchResultListProps) {
  return (
    <div className="w-[55%] overflow-hidden pr-2">
      {results.map((book) => (
        <SearchResultRow
          key={book.isbn}
          book={book}
          onHover={() => onHover(book)}
          onSelect={() => onSelect(book)}
        />
      ))}
    </div>
  );
}
