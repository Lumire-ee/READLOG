import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/features/auth/api/authApi";
import { EmailOnlyField } from "@/features/auth/components/UserFormFields";
import { useEmailOnlyForm } from "@/features/auth/hooks/useAuthForm";
import { mapAuthErrorToKorean } from "@/features/auth/lib/mapAuthErrorToKorean";
import type { EmailOnlyFormValues, Feedback } from "@/features/auth/lib/types";
import { emailOnlyRules } from "@/features/auth/lib/validation";
import UserLayout from "@/layouts/UserLayout";

export default function ForgotPasswordPage() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useEmailOnlyForm();

  async function onSubmit(values: EmailOnlyFormValues) {
    setFeedback(null);

    const { error } = await requestPasswordReset(values.email);

    if (error) {
      setFeedback({
        type: "error",
        message: mapAuthErrorToKorean(error),
      });
      return;
    }

    setFeedback({
      type: "success",
      message: "비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해 주세요.",
    });
  }

  return (
    <UserLayout
      title="비밀번호 재설정 메일"
      subtitle="가입한 이메일을 입력해 주세요"
      footer={
        <div className="mt-4 flex items-center justify-center">
          <Button variant="authText" onClick={() => navigate("/login")}>
            로그인으로 돌아가기
          </Button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-border-default bg-bg-surface space-y-6 rounded-xl border p-6"
      >
        <EmailOnlyField register={register} errors={errors} rules={emailOnlyRules} />

        {feedback ? (
          <p
            className={`typo-label-sm ${
              feedback.type === "error"
                ? "text-status-danger"
                : "text-status-success"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <Button type="submit" variant="authPrimary" disabled={isSubmitting}>
          재설정 메일 보내기
        </Button>
      </form>
    </UserLayout>
  );
}
