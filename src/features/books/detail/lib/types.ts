import type { UserBookWithInfo } from "@/shared/types/db";

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
