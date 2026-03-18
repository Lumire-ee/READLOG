import type { BookStatus } from "@/shared/types/db";

export const STATUS_LABEL: Record<Exclude<BookStatus, "reading">, string> = {
  to_read: "읽기 전",
  completed: "완독",
  quit: "중단",
};

export const UNFILED_VALUE = "__UNFILED__";
