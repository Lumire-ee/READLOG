import { useState } from "react";
import { SignupWithEmail } from "../features/auth/api/authApi";
import { Button } from "@/components/ui/button";
import { mapAuthErrorToKorean } from "../features/auth/lib/mapAuthErrorToKorean";
import { useNavigate } from "react-router-dom";
import type { FormValues, Feedback } from "../features/auth/lib/types";
import UserLayout from "../layouts/UserLayout";
import {
  EmailField,
  PasswordField,
} from "../features/auth/components/UserFormFields";
import {
  emailRules,
  signupPasswordRules,
} from "../features/auth/lib/validation";
import { useAuthForm } from "../features/auth/hooks/useAuthForm";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAuthForm();

  async function onSignup(values: FormValues) {
    setLoading(true);

    const { data, error } = await SignupWithEmail(
      values.email,
      values.password,
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
    <UserLayout
      title="booklog 회원가입"
      subtitle="독서 기록을 시작해보세요"
      footer={
        <div className="mt-4 flex items-center justify-center space-x-2">
          <p className="typo-label-sm text-text-secondary">
            이미 계정이 있으신가요?
          </p>
          <Button variant="authText" onClick={() => navigate("/login")}>
            로그인
          </Button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(onSignup)}
        className="border-border-default bg-bg-surface space-y-6 rounded-xl border p-6"
      >
        <EmailField register={register} errors={errors} rules={emailRules} />

        <PasswordField
          register={register}
          errors={errors}
          rules={signupPasswordRules}
          autoComplete="new-password"
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
          회원가입
        </Button>
      </form>
    </UserLayout>
  );
}
