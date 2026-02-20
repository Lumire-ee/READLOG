import { useState } from "react";
import { LoginWithEmail, signInWithOAuth } from "../features/auth/api/authApi";
import { mapAuthErrorToKorean } from "../features/auth/lib/mapAuthErrorToKorean";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FormValues, Feedback } from "../features/auth/lib/types";
import { useNavigate } from "react-router-dom";
import googleG from "@/assets/google_g.svg";
import KakaoSymbol from "@/assets/kakao_symbol.svg";
import UserLayout from "../layouts/UserLayout";
import {
  EmailField,
  PasswordField,
} from "../features/auth/components/UserFormFields";
import {
  emailRules,
  loginPasswordRules,
} from "../features/auth/lib/validation";
import { useAuthForm } from "../features/auth/hooks/useAuthForm";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAuthForm();

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
      navigate("/onboarding");
      return;
    }
  }

  return (
    <UserLayout
      title="Booklog 로그인"
      subtitle="독서 기록을 시작해보세요"
      footer={
        <>
          <div className="mt-4 flex items-center justify-center">
            <Button variant="authText">비밀번호를 잊으셨나요?</Button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <p className="typo-label-sm text-text-secondary">
              아직 계정이 없으신가요?
            </p>
            <Button variant="authText" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </div>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onLogin)}
        className="border-border-default bg-bg-surface space-y-6 rounded-xl border p-6"
      >
        <div className="space-y-2">
          <Button
            type="button"
            variant="oauthGoogle"
            onClick={() => signInWithOAuth("google")}
          >
            <img
              className="pointer-events-none h-5 w-5 shrink-0 select-none"
              src={googleG}
              alt=""
              aria-hidden="true"
            />
            <span className="typo-label-sm text-text-black select-none">
              Google로 시작하기
            </span>
          </Button>
          <Button
            type="button"
            variant="oauthKakao"
            onClick={() => signInWithOAuth("kakao")}
          >
            <div className="flex items-center gap-2">
              <img
                className="pointer-events-none h-5 w-5 shrink-0 select-none"
                src={KakaoSymbol}
                alt=""
                aria-hidden="true"
              />
              <span className="text-brand-kakao-text typo-label-sm select-none">
                Kakao로 시작하기
              </span>
            </div>
          </Button>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="typo-label-sm text-text-tertiary">OR</span>
            <Separator className="flex-1" />
          </div>

          <EmailField register={register} errors={errors} rules={emailRules} />
        </div>

        <PasswordField
          register={register}
          errors={errors}
          rules={loginPasswordRules}
          autoComplete="current-password"
        />

        {feedback && (
          <p
            className={`typo-label-sm ${
              feedback.type === "error"
                ? "text-status-danger"
                : "text-status-success"
            }`}
          >
            {feedback.message}
          </p>
        )}
        <Button type="submit" variant="authPrimary" disabled={loading}>
          로그인
        </Button>
      </form>
    </UserLayout>
  );
}

