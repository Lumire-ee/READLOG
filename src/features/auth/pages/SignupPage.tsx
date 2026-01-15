import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupWithEmail } from "../api/authApi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mapAuthErrorToKorean } from "../lib/mapAuthErrorToKorean";
import { useNavigate } from "react-router-dom";
import type { FormValues, Feedback } from "../lib/types";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
  });

  async function onSignup(values: FormValues) {
    setLoading(true);

    const { data, error } = await SignupWithEmail(
      values.email,
      values.password
    );

    setLoading(false);

    if (error) {
      setFeedback({ type: "error", message: mapAuthErrorToKorean(error) });
      return;
    }

    if (data.user && !data.user.email_confirmed_at) {
      setFeedback({
        type: "success",
        message: "이메일로 전송된 인증 링크를 확인해주세요.",
      });
      return;
    }

    // Confirm email OFF인 경우: 즉시 가입 완료 (현재 설정)
    setFeedback({ type: "success", message: "회원가입이 완료되었습니다." });
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="typo-heading-lg text-label-primary">
            booklog 회원가입
          </h1>
          <p className="mt-2 typo-label-sm text-label-secondary">
            독서 기록을 시작해보세요
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit(onSignup)}
          className="border border-gray-4 bg-white rounded-xl p-6 space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={cn(
                "typo-label-sm text-label-primary",
                errors.email && "text-accent-red"
              )}
            >
              Email
            </label>

            <input
              id="email"
              className="w-full rounded-md border border-gray-2 px-3 py-2 typo-label-sm"
              autoComplete="email"
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              })}
            />
            {errors.email?.message && (
              <p className="typo-label-sm text-accent-red">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className={cn(
                "typo-label-sm text-label-primary",
                errors.password && "text-accent-red"
              )}
            >
              Password
            </label>

            <input
              id="password"
              className="w-full rounded-md border border-gray-2 px-3 py-2 typo-label-sm"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                minLength: {
                  value: 6,
                  message: "비밀번호는 최소 6자 이상이어야 합니다.",
                },
              })}
            />
            {errors.password?.message && (
              <p className="typo-label-sm text-accent-red">
                {errors.password.message}
              </p>
            )}
          </div>
          {feedback && (
            <p
              className={`typo-label-sm ${
                feedback.type === "error"
                  ? "text-accent-red"
                  : "text-accent-green"
              }`}
            >
              {feedback.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-xl btn-primary cursor-pointer py-2 typo-label-sm font-medium text-gray-6"
            disabled={loading}
          >
            회원가입
          </Button>
        </form>

        {/* Footer */}
        <div className="w-full max-w-sm">
          <div className="flex justify-center items-center mt-4 space-x-2">
            <p className="typo-label-sm text-label-primary">
              이미 계정이 있으신가요?
            </p>
            <Button
              className="typo-label-sm text-label-primary cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
