import { useQuery } from "@tanstack/react-query";
import { fetchUserBookDetail } from "@/features/books/api/userBookApi";
import type { UserBookWithInfo } from "@/shared/types/db";

type UseBookDetailResult = {
  data: UserBookWithInfo | null;
  loading: boolean;
  errorMessage: string | null;
};

export function useBookDetail(userBookId: string | null): UseBookDetailResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userBookDetail", userBookId],
    queryFn: () => fetchUserBookDetail(userBookId as string),
    enabled: !!userBookId,
    staleTime: 30_000,
  });

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "책 상세 정보를 불러오지 못했습니다."
    : null;

  return {
    data: data ?? null,
    loading: !!userBookId && isLoading,
    errorMessage,
  };
}
