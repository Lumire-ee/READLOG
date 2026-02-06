import HomeLayout from "@/layouts/HomeLayout";
import HomeHeader from "@/features/profile/components/HomeHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileNickname } from "@/features/profile/api/profileApi";
import { Logout } from "@/features/auth/api/authApi";
import SearchWidget from "@/features/books/components/SearchWidget";
import { useToast } from "@/hooks/useToast";
import type { SearchBook } from "@/features/books/lib/types";

export default function HomePage() {
  const { registerBookToast } = useToast();

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    (async () => {
      const { nickname } = await getProfileNickname(user.id);
      if (!mounted) return;
      setNickname(nickname);
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await Logout();
    setIsLoggingOut(false);
    navigate("/login", { replace: true });
  }

  async function handleRegister(book: SearchBook) {
    await registerBookToast(book, {
      onOpenDetail: (userBookId) => {
        // TODO: 책 상세보기 Modal 구현
        console.log("책 상세보기 Modal", userBookId);
      },
    });
  }
  if (loading) return null;

  return (
    <HomeLayout
      header={
        <HomeHeader
          nickname={nickname}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      }
    >
      {/* 검색 UI 영역 */}
      <section className="flex items-center justify-center">
        <SearchWidget onRegister={handleRegister} />
      </section>

      {/* main1: 읽고 있는 책 */}
      <section className="border-border-default bg-bg-surface rounded-xl border p-6">
        <h2 className="typo-heading-sm text-text-primary">읽고 있는 책</h2>
        <div className="mt-4">
          {/* TODO: 진행도 + Finish/Pause 포함 그리드 */}
        </div>
      </section>

      {/* main2: 읽을 책 / 다 읽은 책 */}
      <section className="border-border-default bg-bg-surface rounded-xl border p-6">
        <h2 className="typo-heading-sm text-text-primary">
          읽을 책 / 다 읽은 책
        </h2>
        <div className="mt-4">
          {/* TODO: 라벨(Finished/Quit 선택값) + 별점 포함 그리드 */}
        </div>
      </section>
    </HomeLayout>
  );
}
