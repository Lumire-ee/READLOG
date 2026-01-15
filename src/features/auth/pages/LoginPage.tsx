import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginWithEmail, signInWithOAuth } from "../api/authApi";
import { mapAuthErrorToKorean } from "../lib/mapAuthErrorToKorean";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormValues, Feedback } from "../lib/types";
import { useNavigate } from "react-router-dom";
import googleG from "@/assets/google_g.svg";
import KakaoSymbol from "@/assets/kakao_symbol.svg";

export default function LoginPage() {
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

  async function onLogin(values: FormValues) {
    setLoading(true);
    setFeedback(null);

    const { data, error } = await LoginWithEmail(values.email, values.password);

    setLoading(false);
    if (error) {
      setFeedback({ type: "error", message: mapAuthErrorToKorean(error) });
      return;
    }

    if (data.user) {
      // Todo: 닉네임 온보딩
      // 1) Profile Table 프로필 조회
      // 2) 닉네임이 없으면 닉네임 설정 모달 표시

      navigate("/search");
      return;
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="typo-heading-lg text-label-primary">booklog 로그인</h1>
          <p className="mt-2 typo-label-sm text-label-secondary">
            독서 기록을 시작해보세요
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit(onLogin)}
          className="border border-gray-4 bg-white rounded-xl p-6 space-y-6"
        >
          <div className="space-y-2">
            <Button
              type="button"
              className="w-full h-10 rounded-xl border border-[#747775] 1px inside bg-white flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => signInWithOAuth("google")}
            >
              <img
                className="h-5 w-5 shrink-0 select-none pointer-events-none"
                src={googleG}
                alt=""
                aria-hidden="true"
              />
              <span className="select-none typo-label-sm text-primary">
                Google로 시작하기
              </span>
            </Button>
            <Button
              type="button"
              className="w-full h-10 rounded-xl gap-2 cursor-pointer flex items-center justify-center bg-[#FEE500] py-3"
              onClick={() => signInWithOAuth("kakao")}
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-5 w-5 shrink-0 select-none pointer-events-none"
                  src={KakaoSymbol}
                  alt=""
                  aria-hidden="true"
                />
                <span className="text-black/85 select-none typo-label-sm">
                  Kakao로 시작하기
                </span>
              </div>
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-4" />
              <span className="typo-label-sm text-label-tertiary">OR</span>
              <div className="h-px flex-1 bg-gray-4" />
            </div>

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
            로그인
          </Button>
        </form>

        {/* Footer */}
        <div className="w-full max-w-sm">
          <div className="flex justify-center items-center mt-4">
            <Button className="typo-label-sm text-label-primary cursor-pointer">
              비밀번호를 잊으셨나요?
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <p className="typo-label-sm text-label-secondary">
              계정이 없으신가요?
            </p>
            <Button
              className="typo-label-sm text-label-primary cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
