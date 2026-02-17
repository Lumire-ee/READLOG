type SupabaseErrorLike = {
  code?: string | null;
  message?: string | null;
};

export function mapSupabaseErrorToKorean(error: SupabaseErrorLike): string {
  switch (error.code) {
    case "23514":
      return "날짜와 상태를 다시 확인해주세요.";
    case "P0001":
      return "입력한 날짜가 유효하지 않아요. 시작일과 종료일을 확인해주세요.";
    case "42501":
      return "저장 권한이 없거나 로그인 정보가 만료되었어요. 다시 시도해주세요.";
    case "PGRST116":
      return "수정할 데이터를 찾지 못했어요. 목록을 새로고침한 뒤 다시 시도해주세요.";
    default:
      return "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}

