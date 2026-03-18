import { useMemo, useState } from "react";
import type { UserBookWithInfo } from "@/shared/types/db";
import { deriveSelection } from "@/features/home/lib/librarySectionSelectors";

export function useLibraryMultiSelect(items: UserBookWithInfo[]) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { availableBookIdSet, selectedBookIds, selectedBookIdSet, selectedBooks } =
    useMemo(() => deriveSelection(items, selectedIds), [items, selectedIds]);

  const selectedCount = selectedBookIds.length;

  function toggleBookSelected(userBookId: string) {
    if (!availableBookIdSet.has(userBookId)) return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userBookId)) {
        next.delete(userBookId);
      } else {
        next.add(userBookId);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function toggleEditMode() {
    setIsEditMode((prev) => !prev);
  }

  return {
    isEditMode,
    selectedIds,
    selectedBookIds,
    selectedBookIdSet,
    selectedBooks,
    selectedCount,
    toggleBookSelected,
    toggleEditMode,
    clearSelection,
  };
}
