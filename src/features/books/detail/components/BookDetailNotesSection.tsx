import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  BookDetailFormFullRow,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";

type Props = {
  notes: string | null;
  onNotesChange: (value: string) => void;
};

export default function BookDetailNotesSection({
  notes,
  onNotesChange,
}: Props) {
  return (
    <BookDetailFormRow>
      <BookDetailFormFullRow>
        <Separator className="mb-5" />
        <Textarea
          className="max-h-48 min-h-24 resize-none overflow-y-auto"
          value={notes ?? ""}
          placeholder="읽으면서 남기고 싶은 메모를 작성해보세요."
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </BookDetailFormFullRow>
    </BookDetailFormRow>
  );
}
