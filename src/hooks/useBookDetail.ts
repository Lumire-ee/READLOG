import { useQuery } from "@tanstack/react-query";
import { fetchUserBookDetail } from "@/features/books/api/userBookApi";
import type { UserBookWithInfo } from "@/shared/types/db";

type UseBookDetailResult = {
  data: UserBookWithInfo | null;
  loading: boolean;
  isError: boolean;
  refetch: () => void;
};

export function useBookDetail(userBookId: string | null): UseBookDetailResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userBookDetail", userBookId],
    queryFn: () => fetchUserBookDetail(userBookId as string),
    enabled: !!userBookId,
    staleTime: 30_000,
  });

  return {
    data: data ?? null,
    loading: !!userBookId && isLoading,
    isError,
    refetch,
  };
}
