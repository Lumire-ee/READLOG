import type { SearchBook } from "../lib/types";
import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import { toProxiedThumbnailSrc } from "../lib/thumbnailProxy";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";

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
      className="hover:bg-bg-surface-hover flex cursor-pointer items-center gap-4 rounded-md px-2 py-3"
    >
      <img
        src={toProxiedThumbnailSrc(book.image, THUMB_SIZES.SMALL)}
        alt={book.title}
        className="bg-bg-surface-subtitle h-16 w-12 rounded-md object-cover"
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
        {/* TODO: shadcn tooltip 추가, border 추가 */}
        <BookPlus />
      </Button>
    </div>
  );
}
