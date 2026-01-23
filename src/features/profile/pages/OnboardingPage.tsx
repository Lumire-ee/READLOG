import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileNickname, upsertProfileNickname } from "../api/profileApi";
import { useAuth } from "@/features/auth/provider/useAuth";
import SetNicknameModal from "../components/SetNicknameModal";

type SubmitResult = { ok: true } | { ok: false; message: string };

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [checking, setChecking] = useState(true);
  const [needsNickname, setNeedsNickname] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      setChecking(true);

      const { nickname, error } = await getProfileNickname(user.id);
      if (error) {
        setNeedsNickname(false);
        setChecking(false);
        return;
      }

      if (nickname) {
        // TODO: /home 으로 이동
        navigate("/search", { replace: true });
        return;
      }

      setNeedsNickname(true);
      setChecking(false);
    })();
  }, [authLoading, user, navigate]);

  const open = !authLoading && !!user && !checking && needsNickname;

  async function handleSubmit(nickname: string): Promise<SubmitResult> {
    if (!user) return { ok: false, message: "로그인 정보가 없습니다." };

    setSubmitting(true);
    const { error } = await upsertProfileNickname(user.id, nickname);
    setSubmitting(false);

    if (error) return { ok: false, message: "닉네임 저장에 실패했습니다." };

    navigate("/search", { replace: true });
    return { ok: true };
  }

  return (
    <SetNicknameModal
      open={open}
      loading={submitting}
      onSubmit={handleSubmit}
    />
  );
}
