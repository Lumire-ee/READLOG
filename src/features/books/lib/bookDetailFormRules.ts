import type {
  EditableUserBookFields,
  UpdateUserBookPatch,
} from "@/features/books/lib/types";
import type { UserBookWithInfo } from "@/shared/types/db";

function isDoneStatus(status: EditableUserBookFields["status"]): boolean {
  return status === "completed" || status === "quit";
}

export function toIntOrNull(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

export function todayKST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

export function createInitialForm(data: UserBookWithInfo): EditableUserBookFields {
  return {
    status: data.status,
    current_page: data.current_page,
    page_count_override: data.page_count_override,
    rating: data.rating,
    notes_md: data.notes_md,
    start_date: data.start_date,
    end_date: data.end_date,
  };
}

export function createCurrentPageText(
  initial: EditableUserBookFields,
): string {
  return initial.current_page == 0 || initial.current_page === null
    ? ""
    : String(initial.current_page);
}

export function createPageCountText(
  initial: EditableUserBookFields,
  bookPageCount: number | null,
): string {
  const initialDisplay = initial.page_count_override ?? bookPageCount;
  return initialDisplay == null ? "" : String(initialDisplay);
}

export function getTotalPageCount(
  form: EditableUserBookFields,
  bookPageCount: number | null,
): number | null {
  return form.page_count_override ?? bookPageCount ?? null;
}

export function applyStatusChange(
  prev: EditableUserBookFields,
  nextStatus: EditableUserBookFields["status"],
): EditableUserBookFields {
  const next: EditableUserBookFields = { ...prev, status: nextStatus };

  if (isDoneStatus(nextStatus)) {
    if (!next.end_date) next.end_date = todayKST();
  } else {
    next.end_date = null;
  }

  return next;
}

export function applyCurrentPageChange(
  prev: EditableUserBookFields,
  nextPage: number | null,
  totalPageCount: number | null,
): EditableUserBookFields {
  const next: EditableUserBookFields = { ...prev, current_page: nextPage };
  const cp = nextPage ?? 0;

  if (totalPageCount !== null && cp >= totalPageCount) {
    next.status = "completed";
    if (!next.end_date) next.end_date = todayKST();
  }

  return next;
}

export function buildUpdateUserBookPatch(
  form: EditableUserBookFields,
  initial: EditableUserBookFields,
): UpdateUserBookPatch {
  const patch: UpdateUserBookPatch = {};

  if (form.status !== initial.status) patch.status = form.status;
  if (form.current_page !== initial.current_page) patch.current_page = form.current_page;
  if (form.page_count_override !== initial.page_count_override) {
    patch.page_count_override = form.page_count_override;
  }
  if (form.rating !== initial.rating) patch.rating = form.rating;
  if (form.notes_md !== initial.notes_md) patch.notes_md = form.notes_md;
  if (form.start_date !== initial.start_date) patch.start_date = form.start_date;
  if (form.end_date !== initial.end_date) patch.end_date = form.end_date;

  return patch;
}

