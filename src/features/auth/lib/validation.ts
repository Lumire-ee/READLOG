import type { FormValues } from "./types";
import type { RegisterOptions } from "react-hook-form";

export const emailRules: RegisterOptions<FormValues, "email"> = {
  required: "이메일을 입력해주세요.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "올바른 이메일 형식이 아닙니다.",
  },
};

export const loginPasswordRules: RegisterOptions<FormValues, "password"> = {
  required: "비밀번호를 입력해주세요.",
};

export const signupPasswordRules: RegisterOptions<FormValues, "password"> = {
  required: "비밀번호를 입력해주세요.",
  minLength: {
    value: 6,
    message: "비밀번호는 최소 6자 이상이어야 합니다.",
  },
};
