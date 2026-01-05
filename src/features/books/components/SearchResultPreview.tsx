import type { SearchBook } from "../lib/types";

interface SearchResultPreviewProps {
  book: SearchBook | null;
}

export default function SearchResultPreview({
  book,
}: SearchResultPreviewProps) {
  if (!book) return null;

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex gap-4 justify-center py-6">
        <div className="shrink-0">
          <img
            src={book.image ?? ""}
            alt={book.title}
            className="w-40 h-56 object-cover rounded-md"
          />
        </div>
      </div>

      <div className="min-w-0 flex flex-col">
        <div className="gap-1 flex flex-col pb-4">
          <h2 className="text-lg font-semibold text-label-primary line-clamp-2">
            {book.title}
          </h2>

          <p className="text-sm text-label-secondary line-clamp-1">
            {book.author}
          </p>
        </div>

        <div className="border-l-2 border-gray-2 pl-3">
          {book.description ? (
            <p className="text-xs text-label-secondary line-clamp-4 leading-relaxed break-keep">
              {book.description}
            </p>
          ) : (
            <p className="text-xs text-label-secondary">
              책 소개가 제공되지 않습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
