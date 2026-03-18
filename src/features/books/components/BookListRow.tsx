import { cn } from "@/lib/utils";
import { toProxiedThumbnailSrc } from "@/features/books/lib/thumbnailProxy";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";
import type { ReactNode } from "react";

type BookListRowProps = {
  leading?: ReactNode;
  thumbnail: string;
  title: string;
  author: string;
  right?: ReactNode;
  topRight?: ReactNode;
  onClick?: () => void;
  onHover?: () => void;
  className?: string;
  titleClassName?: string;
};

function BookListRowContent({
  leading,
  thumbnail,
  title,
  author,
  right,
  titleClassName,
  hasTopRight,
}: Pick<
  BookListRowProps,
  "leading" | "thumbnail" | "title" | "author" | "right" | "titleClassName"
> & {
  hasTopRight: boolean;
}) {
  return (
    <>
      {leading ? (
        <div className="shrink-0">
          {leading}
        </div>
      ) : null}
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
        <div
          className={cn(
            "ml-auto flex shrink-0 flex-col items-end",
            hasTopRight
              ? "transition-[margin] duration-150 ease-out group-hover:mr-10 group-focus-within:mr-10"
              : "",
          )}
        >
          {right}
        </div>
      ) : null}
    </>
  );
}

export default function BookListRow({
  leading,
  thumbnail,
  title,
  author,
  right,
  topRight,
  onClick,
  onHover,
  className,
  titleClassName,
}: BookListRowProps) {
  const rowClassName = cn(
    "group hover:bg-bg-surface-hover has-[button[data-item-menu='true']:hover]:bg-transparent focus-visible:ring-ring flex items-center gap-4 rounded-md px-2 py-3 text-left transition-colors w-full min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    className,
  );

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onMouseEnter={onHover}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        className={cn("relative cursor-pointer whitespace-normal", rowClassName)}
      >
        {topRight ? (
          <div className="absolute top-1/2 right-1 z-10 -translate-y-1/2">
            {topRight}
          </div>
        ) : null}
        <BookListRowContent
          leading={leading}
          thumbnail={thumbnail}
          title={title}
          author={author}
          right={right}
          titleClassName={titleClassName}
          hasTopRight={Boolean(topRight)}
        />
      </div>
    );
  }

  return (
    <div onMouseEnter={onHover} className={cn("relative", rowClassName)}>
      {topRight ? (
        <div className="absolute top-1/2 right-1 z-10 -translate-y-1/2">
          {topRight}
        </div>
      ) : null}
      <BookListRowContent
        leading={leading}
        thumbnail={thumbnail}
        title={title}
        author={author}
        right={right}
        titleClassName={titleClassName}
        hasTopRight={Boolean(topRight)}
      />
    </div>
  );
}
