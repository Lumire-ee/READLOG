import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserBook } from "@/features/books/api/userBookApi";
import type { UpdateUserBookPatch } from "@/features/books/lib/types";

export function useUpdateUserBook(userBookId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (patch: UpdateUserBookPatch) =>
      updateUserBook(userBookId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userBookDetail", userBookId] });
    },
  });
}
