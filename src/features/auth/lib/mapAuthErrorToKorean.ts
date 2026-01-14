type AuthErrorLike = {
  code?: string | null;
  message?: string;
};

export function mapAuthErrorToKorean(error: AuthErrorLike): string {
  switch (error.code) {
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일입니다.";

    case "email_address_invalid":
      return "올바른 이메일 형식이 아닙니다.";

    case "email_address_not_authorized":
      return "허용되지 않은 이메일 주소입니다. (문의해주세요)";

    case "signup_disabled":
    case "email_provider_disabled":
      return "현재 회원가입이 불가능합니다. 잠시 후 다시 시도해주세요";

    default:
      return (
        error.message ??
        "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
  }
}
