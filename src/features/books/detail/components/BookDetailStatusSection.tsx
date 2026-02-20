import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookDetailFormContent,
  BookDetailFormLabel,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import type { EditableUserBookFields } from "@/features/books/detail/lib/types";
import { BookOpen, CircleCheck, CircleSlash, Clock } from "lucide-react";

type Props = {
  status: EditableUserBookFields["status"];
  onStatusChange: (status: EditableUserBookFields["status"]) => void;
};

export default function BookDetailStatusSection({
  status,
  onStatusChange,
}: Props) {
  return (
    <BookDetailFormRow>
      <BookDetailFormLabel>상태</BookDetailFormLabel>
      <BookDetailFormContent>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-full px-3">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to_read">
              <Badge variant="to_read">
                <Clock />
                읽기 전
              </Badge>
            </SelectItem>
            <SelectItem value="reading">
              <Badge variant="reading">
                <BookOpen />
                읽는 중
              </Badge>
            </SelectItem>
            <SelectItem value="completed">
              <Badge variant="completed">
                <CircleCheck />
                완독
              </Badge>
            </SelectItem>
            <SelectItem value="quit">
              <Badge variant="quit">
                <CircleSlash />
                중단
              </Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </BookDetailFormContent>
    </BookDetailFormRow>
  );
}

