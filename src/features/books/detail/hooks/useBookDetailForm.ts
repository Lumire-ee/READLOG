import { useCallback, useMemo, useState } from "react";
import type {
  EditableUserBookFields,
  UpdateUserBookPatch,
} from "@/features/books/detail/lib/types";
import type { UserBookWithInfo } from "@/shared/types/db";
import {
  applyCurrentPageChange,
  applyStatusChange,
  buildUpdateUserBookPatch,
  createCurrentPageText,
  createInitialForm,
  createPageCountText,
  getTotalPageCount,
  toIntOrNull,
} from "@/features/books/detail/lib/bookDetailFormRules";

type UseBookDetailFormParams = {
  data: UserBookWithInfo;
};

type UseBookDetailFormResult = {
  form: EditableUserBookFields;
  currentPageText: string;
  pageCountText: string;
  totalPageCount: number | null;
  patch: UpdateUserBookPatch;
  isDirty: boolean;
  onStatusChange: (status: EditableUserBookFields["status"]) => void;
  onCurrentPageTextChange: (text: string) => void;
  onPageCountTextChange: (text: string) => void;
  onRatingToggle: (value: number) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

export function useBookDetailForm({
  data,
}: UseBookDetailFormParams): UseBookDetailFormResult {
  const initial = useMemo(() => createInitialForm(data), [data]);

  const [form, setForm] = useState<EditableUserBookFields>(initial);
  const [currentPageText, setCurrentPageText] = useState<string>(() =>
    createCurrentPageText(initial),
  );
  const [pageCountText, setPageCountText] = useState<string>(() =>
    createPageCountText(initial, data.book.page_count),
  );

  const totalPageCount = useMemo(
    () => getTotalPageCount(form, data.book.page_count),
    [form, data.book.page_count],
  );

  const patch = useMemo(
    () => buildUpdateUserBookPatch(form, initial),
    [form, initial],
  );

  const isDirty = Object.keys(patch).length > 0;

  const onStatusChange = useCallback(
    (status: EditableUserBookFields["status"]) => {
      setForm((prev) => applyStatusChange(prev, status));
    },
    [],
  );

  const onCurrentPageTextChange = useCallback(
    (text: string) => {
      if (!/^\d*$/.test(text)) return;

      const nextPage = text.trim() === "" ? null : Number(text);
      if (
        totalPageCount !== null &&
        nextPage !== null &&
        nextPage > totalPageCount
      ) {
        return;
      }

      setCurrentPageText(text);
      setForm((prev) => applyCurrentPageChange(prev, nextPage, totalPageCount));
    },
    [totalPageCount],
  );

  const onPageCountTextChange = useCallback(
    (text: string) => {
      const nextOverride = toIntOrNull(text);
      const nextTotalPageCount = nextOverride ?? data.book.page_count ?? null;
      const currentPage = form.current_page ?? null;

      if (
        currentPage !== null &&
        nextTotalPageCount !== null &&
        nextTotalPageCount < currentPage
      ) {
        return;
      }

      setPageCountText(text);

      setForm((prev) => {
        const base = { ...prev, page_count_override: nextOverride };

        return applyCurrentPageChange(
          base,
          base.current_page,
          nextTotalPageCount,
        );
      });
    },
    [data.book.page_count, form.current_page],
  );

  const onRatingToggle = useCallback((value: number) => {
    setForm((prev) => ({
      ...prev,
      rating: prev.rating === value ? null : value,
    }));
  }, []);

  const onStartDateChange = useCallback((value: string) => {
    setForm((prev) => ({
      ...prev,
      start_date: value.trim() === "" ? null : value,
    }));
  }, []);

  const onEndDateChange = useCallback((value: string) => {
    setForm((prev) => ({
      ...prev,
      end_date: value.trim() === "" ? null : value,
    }));
  }, []);

  const onNotesChange = useCallback((value: string) => {
    setForm((prev) => ({
      ...prev,
      notes_md: value.trim() === "" ? null : value,
    }));
  }, []);

  return {
    form,
    currentPageText,
    pageCountText,
    totalPageCount,
    patch,
    isDirty,
    onStatusChange,
    onCurrentPageTextChange,
    onPageCountTextChange,
    onRatingToggle,
    onStartDateChange,
    onEndDateChange,
    onNotesChange,
  };
}

