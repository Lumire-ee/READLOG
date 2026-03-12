import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import type {
  EmailOnlyFormValues,
  FormValues,
  ResetPasswordFormValues,
} from "./types";

const PASSWORD_REQUIRED_MESSAGE = "비밀번호를 입력해 주세요.";
const PASSWORD_MIN_LENGTH_MESSAGE = "비밀번호는 최소 6자 이상이어야 합니다.";

const EMAIL_REQUIRED_MESSAGE = "이메일을 입력해 주세요.";
const EMAIL_PATTERN_MESSAGE = "올바른 이메일 형식이 아닙니다.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailRules: RegisterOptions<FormValues, "email"> = {
  required: EMAIL_REQUIRED_MESSAGE,
  pattern: {
    value: EMAIL_PATTERN,
    message: EMAIL_PATTERN_MESSAGE,
  },
};

export const emailOnlyRules: RegisterOptions<EmailOnlyFormValues, "email"> = {
  required: EMAIL_REQUIRED_MESSAGE,
  pattern: {
    value: EMAIL_PATTERN,
    message: EMAIL_PATTERN_MESSAGE,
  },
};

export const loginPasswordRules: RegisterOptions<FormValues, "password"> = {
  required: PASSWORD_REQUIRED_MESSAGE,
};

export const signupPasswordRules: RegisterOptions<FormValues, "password"> = {
  required: PASSWORD_REQUIRED_MESSAGE,
  minLength: {
    value: 6,
    message: PASSWORD_MIN_LENGTH_MESSAGE,
  },
};

export const resetPasswordRules: RegisterOptions<
  ResetPasswordFormValues,
  "password"
> = {
  required: PASSWORD_REQUIRED_MESSAGE,
  minLength: {
    value: 6,
    message: PASSWORD_MIN_LENGTH_MESSAGE,
  },
};

export function passwordConfirmRules(
  getValues: UseFormGetValues<ResetPasswordFormValues>,
): RegisterOptions<ResetPasswordFormValues, "passwordConfirm"> {
  return {
    required: "비밀번호 확인을 입력해 주세요.",
    validate: (value) =>
      value === getValues("password") || "비밀번호가 일치하지 않습니다.",
  };
}
