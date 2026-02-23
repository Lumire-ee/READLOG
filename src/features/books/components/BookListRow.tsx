import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toProxiedThumbnailSrc } from "@/features/books/lib/thumbnailProxy";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";
import type { ReactNode } from "react";

type BookListRowProps = {
  thumbnail: string;
  title: string;
  author: string;
  right?: ReactNode;
  onClick?: () => void;
  onHover?: () => void;
  className?: string;
  titleClassName?: string;
};

function BookListRowContent({
  thumbnail,
  title,
  author,
  right,
  titleClassName,
}: Pick<
  BookListRowProps,
  "thumbnail" | "title" | "author" | "right" | "titleClassName"
>) {
  return (
    <>
      <img
        src={toProxiedThumbnailSrc(thumbnail, THUMB_SIZES.SMALL)}
        alt={title}
        className="bg-bg-surface-subtitle h-16 w-12 shrink-0 rounded-md object-cover"
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "typo-label-md text-text-primary truncate",
            titleClassName,
          )}
        >
          {title}
        </p>
        <p className="typo-label-sm text-text-secondary truncate">{author}</p>
      </div>

      {right ? (
        <div className="ml-auto flex shrink-0 flex-col items-end">{right}</div>
      ) : null}
    </>
  );
}

export default function BookListRow({
  thumbnail,
  title,
  author,
  right,
  onClick,
  onHover,
  className,
  titleClassName,
}: BookListRowProps) {
  const rowClassName = cn(
    "hover:bg-bg-surface-hover flex items-center gap-4 rounded-md px-2 py-3 text-left transition-colors w-full min-w-0",
    className,
  );

  if (onClick) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        onMouseEnter={onHover}
        className={cn(
          "h-auto w-full justify-start whitespace-normal",
          rowClassName,
        )}
      >
        <BookListRowContent
          thumbnail={thumbnail}
          title={title}
          author={author}
          right={right}
          titleClassName={titleClassName}
        />
      </Button>
    );
  }

  return (
    <div onMouseEnter={onHover} className={rowClassName}>
      <BookListRowContent
        thumbnail={thumbnail}
        title={title}
        author={author}
        right={right}
        titleClassName={titleClassName}
      />
    </div>
  );
}

