import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookDetailFormContent,
  BookDetailFormLabel,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarCheck2, CalendarPlus } from "lucide-react";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  isStartDateOpen: boolean;
  isEndDateOpen: boolean;
  setIsStartDateOpen: (open: boolean) => void;
  setIsEndDateOpen: (open: boolean) => void;
  isStartDateDisabled: (date: Date) => boolean;
  isEndDateDisabled: (date: Date) => boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

export default function BookDetailDateSection({
  startDate,
  endDate,
  isStartDateOpen,
  isEndDateOpen,
  setIsStartDateOpen,
  setIsEndDateOpen,
  isStartDateDisabled,
  isEndDateDisabled,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <>
      <BookDetailFormRow>
        <BookDetailFormLabel className="inline-flex items-center gap-1.5">
          <CalendarPlus className="size-3.5" aria-hidden="true" />
          시작일
        </BookDetailFormLabel>
        <BookDetailFormContent>
          <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="dateTrigger"
                className={cn(
                  "h-10 px-3",
                  startDate ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {startDate ? format(startDate, "yyyy-MM-dd") : "비어 있음"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate ?? undefined}
                onSelect={(date) => {
                  onStartDateChange(date ? format(date, "yyyy-MM-dd") : "");
                  setIsStartDateOpen(false);
                }}
                disabled={isStartDateDisabled}
              />
            </PopoverContent>
          </Popover>
        </BookDetailFormContent>
      </BookDetailFormRow>

      <BookDetailFormRow>
        <BookDetailFormLabel className="inline-flex items-center gap-1.5">
          <CalendarCheck2 className="size-3.5" aria-hidden="true" />
          종료일
        </BookDetailFormLabel>
        <BookDetailFormContent>
          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="dateTrigger"
                className={cn(
                  "h-10 px-3",
                  endDate ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {endDate ? format(endDate, "yyyy-MM-dd") : "비어 있음"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate ?? undefined}
                onSelect={(date) => {
                  onEndDateChange(date ? format(date, "yyyy-MM-dd") : "");
                  setIsEndDateOpen(false);
                }}
                disabled={isEndDateDisabled}
              />
            </PopoverContent>
          </Popover>
        </BookDetailFormContent>
      </BookDetailFormRow>
    </>
  );
}

