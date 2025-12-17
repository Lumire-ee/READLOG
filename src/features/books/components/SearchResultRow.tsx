import type { SearchBook } from "../lib/types";
import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";

interface SearchResultRowProps {
  book: SearchBook;
  onHover: () => void;
  onSelect: () => void;
}

export default function SearchResultRow({
  book,
  onHover,
  onSelect,
}: SearchResultRowProps) {
  return (
    <div
      onMouseEnter={onHover}
      className="flex items-center gap-4 py-3 px-2 rounded-md cursor-pointer hover:bg-gray-6"
    >
      <img
        src={book.image || ""}
        alt={book.title}
        className="w-12 h-16 rounded-md object-cover bg-gray-200"
      />
      <div className="flex-1">
        <h3 className="text-sm font-medium line-clamp-1">{book.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
        {book.publisher && <p className="text-xs text-gray-400"></p>}
      </div>

      <Button size="sm" onClick={onSelect}>
        <BookPlus />
      </Button>
    </div>
  );
}
