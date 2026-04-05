import MainSymbol from "@/assets/main_symbol.svg";
import MainSymbolDark from "@/assets/main_symbol_dark.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ThemeToggleButton from "@/features/home/components/ThemeToggleButton";
import LandingSearchFlowDemo from "@/features/landing/components/LandingSearchFlowDemo";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || user) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto flex min-h-screen w-full flex-col gap-3 px-4 py-4 md:gap-6 md:px-6 md:py-6">
        <header className="bg-bg-surface sticky top-0 z-20 flex items-center justify-between rounded-2xl px-3 py-2.5 md:px-5 md:py-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={MainSymbol}
              alt="Booklog"
              className="h-8 w-auto select-none in-[.dark]:hidden"
            />
            <img
              src={MainSymbolDark}
              alt="Booklog"
              className="hidden h-8 w-auto select-none in-[.dark]:block"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="bg-text-primary text-text-inverse hover:bg-action-primary-hover rounded-full border-0 md:hidden"
            >
              <Link to="/signup">시작하기</Link>
            </Button>

            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggleButton />
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/login">로그인</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-text-primary text-text-inverse hover:bg-action-primary-hover rounded-full border-0"
              >
                <Link to="/signup">시작하기</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center">
          <section className="relative h-[90%] w-full self-center overflow-hidden p-2 md:p-4 lg:p-6">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-8">
              <div className="order-1 min-w-0 space-y-8">
                <h1 className="typo-heading-xl text-text-primary text-3xl md:text-5xl">
                  읽는 순간,
                  <br />
                  기록은 시작됩니다
                </h1>
                <p className="typo-body-sm text-text-secondary md:text-base">
                  거창한 분석이나 요약이 아니어도 좋습니다.
                  <br />
                  마음이 머물렀던 순간을 가볍게 붙잡아 두는 것,
                  <br />
                  기록은 거기서부터 시작됩니다.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/login">로그인</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-text-primary text-text-inverse hover:bg-action-primary-hover rounded-full border-0"
                  >
                    <Link to="/signup">지금 시작하기</Link>
                  </Button>
                </div>
              </div>

              <article className="order-2 min-w-0 overflow-hidden rounded-2xl border border-none">
                <LandingSearchFlowDemo />
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
