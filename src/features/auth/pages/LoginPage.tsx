import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginWithEmail, signInWithOAuth } from "../api/authApi";
import { mapAuthErrorToKorean } from "../lib/mapAuthErrorToKorean";
import { Button } from "@/components/ui/button";
import type { FormValues, Feedback } from "../lib/types";
import { useNavigate } from "react-router-dom";
import googleG from "@/assets/google_g.svg";
import KakaoSymbol from "@/assets/kakao_symbol.svg";
import UserLayout from "../components/UserLayout";
import { EmailField, PasswordField } from "../components/UserFormFields";
import { emailRules, loginPasswordRules } from "../lib/validation";

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
    <UserLayout
      title="Booklog 로그인"
      subtitle="독서 기록을 시작해보세요"
      footer={
        <>
          <div className="flex justify-center items-center mt-4">
            <Button variant="authText">비밀번호를 잊으셨나요?</Button>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <p className="typo-label-sm text-text-secondary">
              아직 계정이 없으신가요?
            </p>
            <Button
              variant="authText"
              onClick={() => navigate("/")}
              // Todo: SignupPage 라우팅 변경 후 수정
            >
              회원가입
            </Button>
          </div>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onLogin)}
        className="border border-border-default bg-bg-surface rounded-xl p-6 space-y-6"
      >
        <div className="space-y-2">
          <Button
            type="button"
            variant="oauthGoogle"
            onClick={() => signInWithOAuth("google")}
          >
            <img
              className="h-5 w-5 shrink-0 select-none pointer-events-none"
              src={googleG}
              alt=""
              aria-hidden="true"
            />
            <span className="select-none typo-label-sm text-text-primary">
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
                className="h-5 w-5 shrink-0 select-none pointer-events-none"
                src={KakaoSymbol}
                alt=""
                aria-hidden="true"
              />
              <span className="text-brand-kakao-text select-none typo-label-sm">
                Kakao로 시작하기
              </span>
            </div>
          </Button>
          {/* TODO(optional): shadcn Separator 사용 검토 (중복 증가 시) */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-divider" />
            <span className="typo-label-sm text-text-tertiary">OR</span>
            <div className="h-px flex-1 bg-divider" />
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
