import { mapSupabaseErrorToKorean } from "@/shared/utils/mapSupabaseErrorToKorean";

export function toLibraryErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const errorLike = error as { code?: string | null; message?: string | null };
    if (errorLike.message && errorLike.message.trim().length > 0) {
      return errorLike.message;
    }
    return mapSupabaseErrorToKorean(errorLike);
  }
  return "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
