import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserBook } from "@/features/books/detail/api/userBookApi";
import type { UpdateUserBookPatch } from "@/features/books/detail/lib/types";
import { useToast } from "@/hooks/useToast";
import { mapSupabaseErrorToKorean } from "@/shared/utils/mapSupabaseErrorToKorean";

export function useUpdateUserBook(userBookId: string) {
  const qc = useQueryClient();
  const { errorToast, bookSaveSuccessToast } = useToast();

  return useMutation({
    mutationFn: async (patch: UpdateUserBookPatch) =>
      updateUserBook(userBookId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userBookDetail", userBookId] });
      bookSaveSuccessToast();
    },
    onError: (error) => {
      errorToast(mapSupabaseErrorToKorean(error));
    },
  });
}

