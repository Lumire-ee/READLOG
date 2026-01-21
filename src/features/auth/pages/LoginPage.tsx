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
            <Button className="typo-label-sm text-label-primary cursor-pointer">
              비밀번호를 잊으셨나요?
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <p className="typo-label-sm text-label-secondary">
              아직 계정이 없으신가요?
            </p>
            <Button
              className="typo-label-sm text-label-primary cursor-pointer"
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
                ? "text-accent-red"
                : "text-accent-green"
            }`}
          >
            {feedback.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full rounded-full btn-primary cursor-pointer py-2 typo-label-sm font-medium text-gray-6"
          disabled={loading}
        >
          로그인
        </Button>
      </form>
    </UserLayout>
  );
}
