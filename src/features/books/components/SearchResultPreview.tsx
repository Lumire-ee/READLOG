import type { SearchBook } from "../lib/types";

interface SearchResultPreviewProps {
  book: SearchBook | null;
}

export default function SearchResultPreview({
  book,
}: SearchResultPreviewProps) {
  if (!book) return null;

  return (
    <div className="w-[45%]">
      <img
        src={book.image ?? ""}
        alt={book.title}
        className="w-40 h-56 object-cover rounded-md p-2"
      />
      <div className="mt-4 space-y-1">
        <h2 className="text-lg font-semibold text-label-primary">
          {book.title}
        </h2>
        <p className="text-sm text-label-secondary">{book.author}</p>
        {book.description && (
          <p className="text-xs text-label-secondary line-clamp-2">
            {book.description}
          </p>
        )}
      </div>
    </div>
  );
}
