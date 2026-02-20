import { Button } from "@/components/ui/button";
import {
  BookDetailFormContent,
  BookDetailFormLabel,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import type { EditableUserBookFields } from "@/features/books/detail/lib/types";
import { Star } from "lucide-react";

type Props = {
  rating: EditableUserBookFields["rating"];
  onRatingToggle: (value: number) => void;
};

export default function BookDetailRatingSection({
  rating,
  onRatingToggle,
}: Props) {
  return (
    <BookDetailFormRow>
      <BookDetailFormLabel className="inline-flex items-center gap-1.5">
        <Star className="size-3.5" aria-hidden="true" />
        평점
      </BookDetailFormLabel>
      <BookDetailFormContent className="flex h-10 items-center gap-1 pl-1">
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1;
          const active = rating !== null && rating >= value;

          return (
            <Button
              key={value}
              type="button"
              variant="iconGhost"
              size="icon-sm"
              onClick={() => onRatingToggle(value)}
            >
              <Star
                className={`h-5 w-5 transition ${
                  active
                    ? "fill-accent-yellow text-accent-yellow"
                    : "text-text-tertiary"
                }`}
              />
            </Button>
          );
        })}
      </BookDetailFormContent>
    </BookDetailFormRow>
  );
}