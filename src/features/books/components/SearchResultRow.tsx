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
      className="flex items-center gap-4 py-3 px-2 rounded-md cursor-pointer hover:bg-bg-surface-hover"
    >
      <img
        src={book.image || ""}
        alt={book.title}
        className="w-12 h-16 rounded-md object-cover bg-bg-surface-subtle"
      />
      <div className="flex-1">
        <h3 className="typo-label-md text-text-primary line-clamp-1">
          {book.title}
        </h3>
        <p className="typo-label-sm text-text-secondary line-clamp-1">
          {book.author}
        </p>
        {book.publisher && <p className="typo-label-sm text-text-tertiary"></p>}
      </div>

      <Button variant="iconGhost" size="sm" onClick={onSelect}>
        {/* TODO(Optional): Row에 이벤트 추가 시, 이벤트 버블링 방지 필요 */}
        <BookPlus />
      </Button>
    </div>
  );
}
