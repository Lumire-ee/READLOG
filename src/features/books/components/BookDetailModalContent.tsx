import { Input } from "@/components/ui/input";
import { useBookDetail } from "@/hooks/useBookDetail";
import { toProxiedThumbnailSrc } from "../lib/thumbnailProxy";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";

type BookDetailModalContentProps = {
  userBookId: string;
};

export default function BookDetailModalContent({
  userBookId,
}: BookDetailModalContentProps) {
  const { data, loading, errorMessage } = useBookDetail(userBookId);

  if (loading) {
    return <p className="typo-label-sm text-text-secondary">loading</p>;
  }

  if (errorMessage) {
    return <p className="typo-label-sm text-accent-red">{errorMessage}</p>;
  }

  if (!data) return null;

  const initalPageCount =
    data.page_count_override ?? data.book.page_count ?? undefined;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {data.book.thumbnail ? (
          <img
            src={toProxiedThumbnailSrc(data.book.thumbnail, THUMB_SIZES.SMALL)}
            alt={data.book.title}
            className="h-20 w-14 rounded-sm object-cover"
          />
        ) : (
          <div className="bg-bg-muted h-20 w-14 rounded-sm" />
        )}

        <div className="min-w-0">
          <p className="typo-label-sm text-text-secondary">
            {data.book.author} · {data.book.publisher ?? "출판사 정보 없음"}
          </p>
          <p className="typo-heading-sm text-text-primary truncate">
            {data.book.title}
          </p>
          <p className="typo-label-sm text-text-secondary">
            ISBN: {data.book.isbn ?? "없음"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="typo-label-sm text-text-secondary">상태: {data.status}</p>
        <p className="typo-label-sm text-text-secondary">
          현재 페이지: {data.current_page}
        </p>
        <Input type="number" defaultValue={initalPageCount} />
      </div>
    </div>
  );
}
