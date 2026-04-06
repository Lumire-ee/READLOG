import { useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  AtSign,
  Check,
  KeyRound,
  MailPlus,
  ShieldAlert,
  Trash2,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Logout,
  reauthenticateWithPassword,
  requestPasswordReset,
  signInWithOAuthForReauth,
} from "@/features/auth/api/authApi";
import { mapAuthErrorToKorean } from "@/features/auth/lib/mapAuthErrorToKorean";
import {
  BookDetailFormContent as FormContent,
  BookDetailFormLabel as FormLabel,
  BookDetailFormRow as FormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import {
  DeleteMyAccountError,
  deleteMyAccount,
  upsertProfileNickname,
} from "@/features/profile/api/profileApi";
import {
  ACCOUNT_DELETE_REAUTH_WINDOW_MS,
  clearAccountDeletePending,
  getFreshAccountDeletePending,
  isRecentSignIn,
  setAccountDeletePending,
} from "@/features/profile/lib/accountDeletion";
import {
  getPrimaryOAuthProvider,
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

function mapDeleteAccountError(error: unknown) {
  if (error instanceof DeleteMyAccountError) {
    if (error.code === "reauthentication_needed") {
      return "보안을 위해 다시 인증 후 탈퇴를 진행해 주세요.";
    }
    return error.message;
  }

  return "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function EditProfileModal({
  open,
  onOpenChange,
  user,
  currentNickname,
  onSaved,
}: EditProfileModalProps) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { errorToast } = useToast();
  const [nickname, setNickname] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isReauthRequiredOpen, setIsReauthRequiredOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRedirectingForOAuth, setIsRedirectingForOAuth] = useState(false);

  const email = getUserEmail(user);
  const canResetPassword = isEmailPasswordUser(user) && email.length > 0;
  const oauthProvider = getPrimaryOAuthProvider(user);
  const oauthProviderLabel = oauthProvider === "google" ? "Google" : "Kakao";
  const hasRecentReauth = isRecentSignIn(user.last_sign_in_at);
  const isNicknameDirty =
    normalizeNickname(nickname) !== normalizeNickname(currentNickname);
  const reauthWindowMinutes = Math.floor(
    ACCOUNT_DELETE_REAUTH_WINDOW_MS / (60 * 1000),
  );

  const canSubmitDelete = useMemo(() => {
    if (canResetPassword) {
      return deletePassword.trim().length > 0;
    }

    if (!oauthProvider) return false;

    return true;
  }, [canResetPassword, deletePassword, oauthProvider]);

  const shouldResumeDeleteConfirm = Boolean(
    open && getFreshAccountDeletePending(oauthProvider),
  );
  const isAlertOpen =
    open && (isDeleteConfirmOpen || shouldResumeDeleteConfirm);

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

  function handleDeleteDialogOpenChange(nextOpen: boolean) {
    setIsDeleteConfirmOpen(nextOpen);

    if (!nextOpen) {
      clearAccountDeletePending();
      setDeletePassword("");
      setDeleteError(null);
      setIsRedirectingForOAuth(false);
    }
  }

  function handleModalOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setIsDeleteConfirmOpen(false);
      setIsReauthRequiredOpen(false);
      setDeletePassword("");
      setDeleteError(null);
      setIsRedirectingForOAuth(false);
      clearAccountDeletePending();
    }

    onOpenChange(nextOpen);
  }

  async function handleDeleteAccount() {
    try {
      await deleteMyAccount();
      clearAccountDeletePending();

      await Logout();
      toast.success("회원 탈퇴가 완료되었습니다.");
      onOpenChange(false);
      navigate("/", { replace: true });
    } catch (deleteAccountError) {
      setDeleteError(mapDeleteAccountError(deleteAccountError));
    }
  }

  async function handleDeleteWithPassword() {
    if (!email) return;

    const password = deletePassword.trim();
    if (!password) {
      setDeleteError("비밀번호를 입력해 주세요.");
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);
    const { error: reauthError } = await reauthenticateWithPassword(
      email,
      password,
    );

    if (reauthError) {
      setIsDeleting(false);
      setDeleteError(mapAuthErrorToKorean(reauthError));
      return;
    }

    await handleDeleteAccount();
    setIsDeleting(false);
  }

  async function handleStartOAuthReauth() {
    if (!oauthProvider) return;

    setDeleteError(null);
    setIsReauthRequiredOpen(false);
    setIsRedirectingForOAuth(true);
    setAccountDeletePending(oauthProvider);

    const { error: oauthError } = await signInWithOAuthForReauth(
      oauthProvider,
      "/home",
    );

    if (oauthError) {
      clearAccountDeletePending();
      setIsRedirectingForOAuth(false);
      setDeleteError(mapAuthErrorToKorean(oauthError));
    }
  }

  async function handleDeleteWithOAuth() {
    if (!hasRecentReauth) {
      setDeleteError(null);
      setIsDeleteConfirmOpen(false);
      setIsReauthRequiredOpen(true);
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);
    await handleDeleteAccount();
    setIsDeleting(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
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

          <Separator />

          {canResetPassword ? (
            <FormRow className="items-center">
              <FormLabel className="inline-flex items-center gap-1.5">
                <KeyRound className="size-3.5" />
                비밀번호
              </FormLabel>
              <FormContent className="flex-col items-start gap-2 px-1.5 py-1">
                <p className="typo-label-sm text-text-secondary">
                  비밀번호 변경 후엔 보안을 위해 로그아웃됩니다.
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
          ) : null}

          <FormRow className="items-center">
            <FormLabel className="inline-flex items-center gap-1.5">
              <ShieldAlert className="size-3.5" />
              회원 탈퇴
            </FormLabel>
            <FormContent className="flex-col items-start gap-2 px-1.5 py-1">
              <p className="typo-label-sm text-status-danger">
                탈퇴하면 계정과 독서 데이터가 모두 삭제되며 복구할 수 없습니다.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setDeleteError(null);
                  setDeletePassword("");
                  setIsDeleteConfirmOpen(true);
                }}
                className="typo-label-sm hover:text-accent-red focus-visible:text-accent-red h-8 gap-1.5 px-3"
              >
                <Trash2 className="size-3.5" />
                회원 탈퇴
              </Button>
            </FormContent>
          </FormRow>
        </div>
        <Dialog open={isAlertOpen} onOpenChange={handleDeleteDialogOpenChange}>
          <DialogContent className="bg-bg-elevated">
            <DialogHeader className="items-center text-center sm:text-center">
              <AlertTriangle
                aria-hidden="true"
                className="text-accent-red/80 mb-1 size-9"
              />
              <DialogTitle>계정을 삭제할까요?</DialogTitle>
              <div className="mb-3 flex items-center justify-center gap-2">
                <span
                  aria-hidden
                  className="bg-accent-indigo h-4 w-0.5 shrink-0 rounded-full"
                />
                <span className="text-text-primary block truncate font-semibold">
                  {email}
                </span>
              </div>
              <DialogDescription>
                탈퇴 시 계정과 기록된 독서 데이터가 영구 삭제되며,
                <br />
                삭제 후에는 다시 복구할 수 없습니다.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {canResetPassword ? (
                <div className="space-y-2">
                  <p className="typo-label-sm text-text-secondary">
                    본인 확인을 위해 비밀번호를 입력해 주세요.
                  </p>
                  <Input
                    type="password"
                    variant="interactiveRow"
                    value={deletePassword}
                    placeholder="비밀번호 입력"
                    onChange={(event) => {
                      setDeletePassword(event.target.value);
                      setDeleteError(null);
                    }}
                    disabled={isDeleting}
                  />
                </div>
              ) : null}

              {deleteError ? (
                <p className="typo-label-sm text-status-danger text-center">
                  {deleteError}
                </p>
              ) : null}
            </div>

            <DialogFooter className="flex-row justify-center sm:justify-center">
              <Button
                type="button"
                variant="dialogCancel"
                disabled={isDeleting}
                onClick={() => handleDeleteDialogOpenChange(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="dialogDanger"
                disabled={
                  !canSubmitDelete || isDeleting || isRedirectingForOAuth
                }
                onClick={() => {
                  if (canResetPassword) {
                    void handleDeleteWithPassword();
                    return;
                  }
                  void handleDeleteWithOAuth();
                }}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isReauthRequiredOpen}
          onOpenChange={setIsReauthRequiredOpen}
        >
          <DialogContent className="bg-bg-elevated sm:max-w-md">
            <DialogHeader className="items-center text-center sm:text-center">
              <AlertTriangle
                aria-hidden="true"
                className="text-accent-red/80 mb-1 size-9"
              />
              <DialogTitle>재인증이 필요합니다</DialogTitle>
              <DialogDescription>
                보안을 위해 최근 {reauthWindowMinutes}분 내 본인 확인이
                필요합니다.
                <br />
                계속하면 {oauthProviderLabel} 인증 페이지로 이동합니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-center sm:justify-center">
              <Button
                type="button"
                variant="dialogCancel"
                onClick={() => setIsReauthRequiredOpen(false)}
                disabled={isRedirectingForOAuth}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="dialogDanger"
                onClick={() => void handleStartOAuthReauth()}
                disabled={isRedirectingForOAuth}
              >
                {isRedirectingForOAuth
                  ? "인증 페이지로 이동 중..."
                  : "인증 페이지로 이동"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
