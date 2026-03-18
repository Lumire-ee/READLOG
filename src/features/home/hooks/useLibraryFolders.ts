import { useQuery } from "@tanstack/react-query";
import { fetchLibraryFolders } from "@/features/home/api/libraryFolderApi";

export function useLibraryFolders(userId: string | null) {
  return useQuery({
    queryKey: ["libraryFolders", userId],
    queryFn: async () => {
      if (!userId) return [];
      return fetchLibraryFolders(userId);
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
