import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/features/auth/api/authApi";
import ResetPasswordFields from "@/features/auth/components/ResetPasswordFields";
import { mapAuthErrorToKorean } from "@/features/auth/lib/mapAuthErrorToKorean";
import type {
  Feedback,
  ResetPasswordFormValues,
} from "@/features/auth/lib/types";
import {
  passwordConfirmRules,
  resetPasswordRules,
} from "@/features/auth/lib/validation";
import UserLayout from "@/layouts/UserLayout";

const INVALID_RECOVERY_TITLE =
  "유효하지 않거나 만료된 비밀번호 재설정 링크입니다.";
const INVALID_RECOVERY_DESCRIPTION =
  "비밀번호 재설정 메일을 다시 요청해 주세요.";
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback>(null);

  // 재설정 링크를 통해서 들어왔는지 판별
  const hasRecoveryContext = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.replace("#", ""),
    );

    return (
      searchParams.get("type") === "recovery" ||
      hashParams.get("type") === "recovery" ||
      searchParams.has("code") ||
      hashParams.has("access_token")
    );
  }, []);

  const {
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!hasRecoveryContext) return;

    setFeedback(null);
    const { error } = await updatePassword(values.password);

    if (error) {
      setFeedback({
        type: "error",
        message: mapAuthErrorToKorean(error),
      });
      return;
    }

    reset();
    navigate("/login", { replace: true });
  }

  if (!hasRecoveryContext) {
    return (
      <UserLayout
        title="비밀번호 재설정"
        subtitle="유효하지 않은 재설정 링크입니다"
      >
        <div className="border-border-default bg-bg-surface space-y-6 rounded-xl border p-6">
          <div className="space-y-1">
            <p className="typo-label-sm text-status-danger">
              {INVALID_RECOVERY_TITLE}
            </p>
            <p className="typo-label-sm text-status-danger">
              {INVALID_RECOVERY_DESCRIPTION}
            </p>
          </div>
          <Button
            type="button"
            variant="authPrimary"
            onClick={() => navigate("/forgot-password")}
          >
            메일 다시 요청하기
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title="비밀번호 재설정" subtitle="새 비밀번호를 입력해 주세요">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-border-default bg-bg-surface space-y-6 rounded-xl border p-6"
      >
        <ResetPasswordFields
          register={register}
          errors={errors}
          passwordRules={resetPasswordRules}
          passwordConfirmRules={passwordConfirmRules(getValues)}
        />

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
          비밀번호 재설정
        </Button>
      </form>
    </UserLayout>
  );
}
