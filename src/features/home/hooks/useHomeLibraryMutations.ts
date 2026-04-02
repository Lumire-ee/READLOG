import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useToast } from "@/hooks/useToast";
import {
  createLibraryFolder,
  deleteLibraryBooks,
  deleteLibraryFolder,
  moveLibraryBooks,
  renameLibraryFolder,
} from "@/features/home/api/libraryFolderApi";
import { toLibraryErrorMessage } from "@/features/home/lib/librarySectionError";

type CreateFolderArgs = {
  name: string;
  userBookIds: string[];
  coverUserBookId: string;
};

type MoveBooksArgs = {
  userBookIds: string[];
  targetFolderId: string | null;
};

type DeleteFolderArgs = {
  folderId: string;
  deleteBooks: boolean;
};

type RenameFolderArgs = {
  folderId: string;
  name: string;
};

export function useHomeLibraryMutations() {
  const qc = useQueryClient();
  const { errorToast } = useToast();

  const onError = (error: unknown) => {
    errorToast(toLibraryErrorMessage(error));
  };

  const invalidateLibraryQueries = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["userBooks"] }),
      qc.invalidateQueries({ queryKey: ["libraryFolders"] }),
    ]);
  };

  const createFolderMutation = useMutation({
    mutationFn: createLibraryFolder,
    onSuccess: async () => {
      await invalidateLibraryQueries();
      toast.success("폴더를 만들었습니다.");
    },
    onError,
  });

  const moveBooksMutation = useMutation({
    mutationFn: moveLibraryBooks,
    onSuccess: async () => {
      await invalidateLibraryQueries();
      toast.success("책을 이동했습니다.");
    },
    onError,
  });

  const deleteBooksMutation = useMutation({
    mutationFn: deleteLibraryBooks,
    onSuccess: async () => {
      await invalidateLibraryQueries();
      toast.success("선택한 책을 삭제했습니다.");
    },
    onError,
  });

  const deleteFolderMutation = useMutation({
    mutationFn: deleteLibraryFolder,
    onSuccess: async (_data, variables) => {
      await invalidateLibraryQueries();
      toast.success(
        variables.deleteBooks
          ? "폴더와 폴더의 책을 삭제했습니다."
          : "폴더를 삭제했습니다.",
      );
    },
    onError,
  });

  const renameFolderMutation = useMutation({
    mutationFn: renameLibraryFolder,
    onSuccess: async () => {
      await invalidateLibraryQueries();
      toast.success("폴더 이름을 변경했습니다.");
    },
    onError,
  });

  return {
    createFolder: (args: CreateFolderArgs) => createFolderMutation.mutateAsync(args),
    moveBooks: (args: MoveBooksArgs) => moveBooksMutation.mutateAsync(args),
    removeBooks: (userBookIds: string[]) =>
      deleteBooksMutation.mutateAsync(userBookIds),
    removeFolder: (args: DeleteFolderArgs) => deleteFolderMutation.mutateAsync(args),
    renameFolder: (args: RenameFolderArgs) => renameFolderMutation.mutateAsync(args),
    isCreatingFolder: createFolderMutation.isPending,
    isMovingBooks: moveBooksMutation.isPending,
    isDeletingBooks: deleteBooksMutation.isPending,
    isDeletingFolder: deleteFolderMutation.isPending,
    isRenamingFolder: renameFolderMutation.isPending,
  };
}
