import HomeLayout from "@/layouts/HomeLayout";
import HomeHeader from "@/features/profile/components/HomeHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileNickname } from "@/features/profile/api/profileApi";
import { Logout } from "@/features/auth/api/authApi";
import SearchWidget from "@/features/books/search/components/SearchWidget";
import { useToast } from "@/hooks/useToast";
import type { SearchBook } from "@/features/books/search/lib/types";
import { useBookDetailModalStore } from "@/features/books/detail/store/useBookDetailModalStore";
import { useUserBooks } from "@/hooks/useUserBooks";
import { Badge } from "@/components/ui/badge";
import type { BookStatus } from "@/shared/types/db";
import HomeBookSection from "@/pages/home/components/HomeBookSection";
import HomeRatingStars from "@/pages/home/components/HomeRatingStars";

const STATUS_LABEL: Record<Exclude<BookStatus, "reading">, string> = {
  to_read: "읽기 전",
  completed: "완독",
  quit: "중단",
};

export default function HomePage() {
  const openBookDetail = useBookDetailModalStore((state) => state.open);
  const { registerBookToast } = useToast();

  const { user, loading } = useAuth();
  const {
    data: userBooks,
    loading: booksLoading,
    isError: booksError,
  } = useUserBooks(user?.id ?? null);
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
        openBookDetail(userBookId);
      },
    });
  }
  if (loading) return null;

  const section1 = userBooks.filter((item) => item.status === "reading");
  const section2 = userBooks.filter((item) => item.status !== "reading");

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

      {/* Section 1 */}
      <section className="border-border-default bg-bg-surface rounded-xl border p-6">
        {/* TODO: 진행도 + Finish/Pause 포함 그리드 */}
        <HomeBookSection
          title="읽고 있는 책"
          loading={booksLoading}
          isError={booksError}
          items={section1}
          emptyText="읽고 있는 책이 없습니다."
          onOpenBook={openBookDetail}
        />
      </section>

      {/* Section 2 */}
      <section className="border-border-default bg-bg-surface rounded-xl border p-6">
        <HomeBookSection
          title="읽을 책 / 다 읽은 책"
          loading={booksLoading}
          isError={booksError}
          items={section2}
          emptyText="읽을 책 / 다 읽은 책이 없습니다."
          onOpenBook={openBookDetail}
          renderRight={(item) => (
            <div className="flex flex-col items-end gap-1">
              {item.status !== "reading" ? (
                <Badge variant={item.status}>{STATUS_LABEL[item.status]}</Badge>
              ) : null}
              {item.rating !== null ? (
                <HomeRatingStars value={item.rating} />
              ) : null}
            </div>
          )}
        />
      </section>
    </HomeLayout>
  );
}

