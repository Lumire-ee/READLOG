import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AtSign, Check, KeyRound, MailPlus, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { requestPasswordReset } from "@/features/auth/api/authApi";
import { mapAuthErrorToKorean } from "@/features/auth/lib/mapAuthErrorToKorean";
import {
  BookDetailFormContent as FormContent,
  BookDetailFormLabel as FormLabel,
  BookDetailFormRow as FormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import { upsertProfileNickname } from "@/features/profile/api/profileApi";
import {
  getUserEmail,
  isEmailPasswordUser,
} from "@/features/profile/lib/avatar";
import {
  nicknameRules,
  normalizeNickname,
} from "@/features/profile/lib/validation";
import { useToast } from "@/hooks/useToast";

type EditProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  currentNickname: string;
  onSaved?: (nickname: string) => void;
};

export default function EditProfileModal({
  open,
  onOpenChange,
  user,
  currentNickname,
  onSaved,
}: EditProfileModalProps) {
  const qc = useQueryClient();
  const { errorToast } = useToast();
  const [nickname, setNickname] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const email = getUserEmail(user);
  const canResetPassword = isEmailPasswordUser(user) && email.length > 0;
  const isNicknameDirty =
    normalizeNickname(nickname) !== normalizeNickname(currentNickname);

  async function handleSaveNickname() {
    const message = nicknameRules(nickname);
    if (message) {
      setError(message);
      return;
    }

    const normalized = normalizeNickname(nickname);
    setIsSubmitting(true);
    const { error: upsertError } = await upsertProfileNickname(
      user.id,
      normalized,
    );
    setIsSubmitting(false);

    if (upsertError) {
      setError("닉네임을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    toast.success("닉네임이 변경되었습니다.");
    qc.invalidateQueries({ queryKey: ["profileNickname", user.id] });
    onSaved?.(normalized);
    onOpenChange(false);
  }

  async function handleSendPasswordReset() {
    if (!email) return;

    setIsSendingReset(true);
    const { error: resetError } = await requestPasswordReset(email);
    setIsSendingReset(false);

    if (resetError) {
      errorToast(mapAuthErrorToKorean(resetError));
      return;
    }

    toast.success("비밀번호 재설정 이메일을 발송했습니다.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-elevated sm:max-w-[520px]">
        <div className="space-y-4">
          <FormRow>
            <FormLabel className="inline-flex items-center gap-1.5">
              <AtSign className="size-3.5" />
              이메일
            </FormLabel>
            <FormContent>
              <Input value={email} readOnly disabled variant="interactiveRow" />
            </FormContent>
          </FormRow>

          <FormRow className="items-center">
            <FormLabel
              htmlFor="profile-nickname"
              className="inline-flex items-center gap-1.5"
            >
              <UserPen className="size-3.5" />
              닉네임
            </FormLabel>
            <FormContent className="w-full flex-col items-start gap-2">
              <div className="bg-bg-surface hover:bg-bg-surface-hover flex w-full min-w-0 items-center rounded-md px-1.5 transition-colors focus-within:shadow-sm">
                <Input
                  id="profile-nickname"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setError(null);
                  }}
                  disabled={isSubmitting}
                  className="h-10 min-w-0 flex-1 border-0 bg-transparent px-1.5 shadow-none focus-visible:ring-0"
                />
                {isNicknameDirty ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="iconGhost"
                    onClick={handleSaveNickname}
                    disabled={isSubmitting}
                    aria-label="닉네임 변경 저장"
                    className="shrink-0 rounded-md"
                  >
                    <Check className="size-4" />
                  </Button>
                ) : null}
              </div>
              {error ? (
                <p className="typo-label-sm text-status-danger">{error}</p>
              ) : null}
            </FormContent>
          </FormRow>

          {canResetPassword ? (
            <>
              <Separator />
              <FormRow className="items-center">
                <FormLabel className="inline-flex items-center gap-1.5">
                  <KeyRound className="size-3.5" />
                  비밀번호
                </FormLabel>
                <FormContent className="flex-col items-start gap-2 px-1.5 py-1">
                  <p className="typo-label-sm text-text-secondary">
                    비밀번호 변경 후에는 보안을 위해 로그아웃됩니다.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendPasswordReset}
                    disabled={isSendingReset}
                    className="typo-label-sm h-8 gap-1.5 px-3"
                  >
                    <MailPlus className="size-3.5" />
                    비밀번호 재설정 메일 보내기
                  </Button>
                </FormContent>
              </FormRow>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
