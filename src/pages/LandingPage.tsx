import MainSymbol from "@/assets/main_symbol.svg";
import MainSymbolDark from "@/assets/main_symbol_dark.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
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
    <div className="bg-bg-base min-h-screen">
      <div className="max-w-8xl mx-auto flex min-h-screen w-full flex-col gap-6 px-4 py-4 md:gap-8 md:px-6 md:py-6">
        <header className="bg-bg-surface/90 sticky top-4 z-20 flex items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-xs md:px-5">
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
        </header>

        <div className="flex flex-1 items-center">
          <section className="bg-bg-surface relative h-[90%] w-full self-center overflow-hidden p-6 md:p-8 lg:p-10">
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
                  마음이 머물렀던 그 순간을 사라지기 전에 가볍게 붙잡아 두는 것,
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

              <article className="bg-bg-elevated order-2 min-w-0 overflow-hidden rounded-2xl border border-none p-5">
                <LandingSearchFlowDemo />
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
