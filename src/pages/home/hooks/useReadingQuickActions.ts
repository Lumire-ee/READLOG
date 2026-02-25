import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserBook } from "@/features/books/detail/api/userBookApi";

type ReadingStatusAction = "completed" | "quit";

export function useReadingQuickActions() {
  const qc = useQueryClient();

  const {
    mutate: updateStatus,
    variables: pendingVariables,
    isPending: isUpdatingStatus,
  } = useMutation({
    mutationFn: async ({
      userBookId,
      status,
    }: {
      userBookId: string;
      status: ReadingStatusAction;
    }) => updateUserBook(userBookId, { status }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["userBooks"] });
      qc.invalidateQueries({
        queryKey: ["userBookDetail", variables.userBookId],
      });
    },
  });

  return {
    updateStatus,
    pendingVariables,
    isUpdatingStatus,
  };
}

