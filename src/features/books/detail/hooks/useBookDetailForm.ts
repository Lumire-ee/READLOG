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
  pageCountError: string | null;
  totalPageCount: number | null;
  patch: UpdateUserBookPatch;
  isDirty: boolean;
  onStatusChange: (status: EditableUserBookFields["status"]) => void;
  onCurrentPageTextChange: (text: string) => void;
  onCurrentPageBlur: (text: string) => void;
  onPageCountTextChange: (text: string) => void;
  onPageCountBlur: (text: string) => void;
  validatePageCount: (
    nextPageCountText?: string,
    nextCurrentPageText?: string,
  ) => boolean;
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
  const [pageCountError, setPageCountError] = useState<string | null>(null);

  const totalPageCount = useMemo(
    () => getTotalPageCount(form, data.book.page_count),
    [form, data.book.page_count],
  );

  const patch = useMemo(
    () => buildUpdateUserBookPatch(form, initial),
    [form, initial],
  );

  const isDirty = Object.keys(patch).length > 0;

  const getPageCountError = useCallback(
    (text: string, currentPageTextValue: string) => {
      const nextOverride = toIntOrNull(text);
      const nextTotalPageCount = nextOverride ?? data.book.page_count ?? null;
      const currentPage = toIntOrNull(currentPageTextValue);
      if (
        currentPage !== null &&
        nextTotalPageCount !== null &&
        nextTotalPageCount < currentPage
      ) {
        return "총 페이지는 읽은 페이지보다 크거나 같아야 합니다.";
      }
      return null;
    },
    [data.book.page_count],
  );

  const validatePageCount = useCallback(
    (nextPageCountText?: string, nextCurrentPageText?: string) => {
      const pageCountCandidate = nextPageCountText ?? pageCountText;
      const currentPageCandidate = nextCurrentPageText ?? currentPageText;
      const error = getPageCountError(pageCountCandidate, currentPageCandidate);
      setPageCountError(error);
      return error === null;
    },
    [currentPageText, getPageCountError, pageCountText],
  );

  const onStatusChange = useCallback(
    (status: EditableUserBookFields["status"]) => {
      setForm((prev) => applyStatusChange(prev, status));
    },
    [],
  );

  const onCurrentPageTextChange = useCallback(
    (text: string) => {
      if (!/^\d*$/.test(text)) return;
      setCurrentPageText(text);
      setPageCountError(null);

      const nextPage = text.trim() === "" ? null : Number(text);
      if (
        totalPageCount !== null &&
        nextPage !== null &&
        nextPage > totalPageCount
      ) {
        return;
      }

      setForm((prev) => applyCurrentPageChange(prev, nextPage, totalPageCount));
    },
    [totalPageCount],
  );

  const onCurrentPageBlur = useCallback(
    (text: string) => {
      validatePageCount(undefined, text);
    },
    [validatePageCount],
  );

  const onPageCountTextChange = useCallback(
    (text: string) => {
      if (!/^\d*$/.test(text)) return;
      setPageCountText(text);
      setPageCountError(null);

      const nextOverride = toIntOrNull(text);
      const nextTotalPageCount = nextOverride ?? data.book.page_count ?? null;
      if (getPageCountError(text, currentPageText)) {
        return;
      }

      setForm((prev) => {
        const base = { ...prev, page_count_override: nextOverride };

        return applyCurrentPageChange(
          base,
          base.current_page,
          nextTotalPageCount,
        );
      });
    },
    [currentPageText, data.book.page_count, getPageCountError],
  );

  const onPageCountBlur = useCallback(
    (text: string) => {
      validatePageCount(text);
    },
    [validatePageCount],
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
    pageCountError,
    totalPageCount,
    patch,
    isDirty,
    onStatusChange,
    onCurrentPageTextChange,
    onCurrentPageBlur,
    onPageCountTextChange,
    onPageCountBlur,
    validatePageCount,
    onRatingToggle,
    onStartDateChange,
    onEndDateChange,
    onNotesChange,
  };
}
