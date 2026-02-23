import { useQuery } from "@tanstack/react-query";
import { fetchUserBooks } from "@/features/books/detail/api/userBookApi";
import type { UserBookWithInfo } from "@/shared/types/db";

type UseUserBooksResult = {
  data: UserBookWithInfo[];
  loading: boolean;
  isError: boolean;
  refetch: () => void;
};

export function useUserBooks(userId: string | null): UseUserBooksResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => fetchUserBooks(userId as string),
    enabled: !!userId,
    staleTime: 30_000,
  });

  return {
    data: data ?? [],
    loading: !!userId && isLoading,
    isError,
    refetch,
  };
}
