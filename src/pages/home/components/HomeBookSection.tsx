import BookListRow from "@/features/books/components/BookListRow";
import type { UserBookWithInfo } from "@/shared/types/db";
import type { ReactNode } from "react";

type HomeBookSectionProps = {
  title: string;
  loading: boolean;
  isError: boolean;
  items: UserBookWithInfo[];
  emptyText: string;
  onOpenBook: (userBookId: string) => void;
  renderRight?: (item: UserBookWithInfo) => ReactNode;
};

export default function HomeBookSection({
  title,
  loading,
  isError,
  items,
  emptyText,
  onOpenBook,
  renderRight,
}: HomeBookSectionProps) {
  return (
    <div>
      <h2 className="typo-heading-sm text-text-primary">{title}</h2>
      <div className="mt-4">
        {loading ? (
          <p className="typo-label-sm text-text-secondary">
            책 목록을 불러오는 중입니다.
          </p>
        ) : isError ? (
          <p className="typo-label-sm text-status-danger">
            책 목록을 불러오지 못했습니다.
          </p>
        ) : items.length === 0 ? (
          <p className="typo-label-sm text-text-secondary">{emptyText}</p>
        ) : (
          <div className="grid w-full min-w-0 gap-2 md:grid-cols-2">
            {items.map((item) => (
              <BookListRow
                key={item.id}
                thumbnail={item.book.thumbnail!}
                title={item.book.title}
                author={item.book.author}
                onClick={() => onOpenBook(item.id)}
                right={renderRight?.(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

