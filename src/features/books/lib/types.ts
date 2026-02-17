import type { UserBookWithInfo } from "@/shared/types/db";

export type BookSource = "naver" | "google";

export interface SearchBook {
  title: string;
  author: string;
  image: string;
  publisher: string;
  description?: string;
  isbn?: string;
  source: BookSource;
  pageCount?: number;
}

export interface SearchOptions {
  includeVariants?: boolean;
}

export type EditableUserBookFields = Pick<
  UserBookWithInfo,
  | "status"
  | "start_date"
  | "end_date"
  | "current_page"
  | "rating"
  | "notes_md"
  | "page_count_override"
>;

export type UpdateUserBookPatch = Partial<EditableUserBookFields>;
