import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

import { Logout } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { computeReadingStats } from "@/features/stats/lib/stats";
import type { ReadingStats } from "@/features/stats/lib/types";
import { useUserBooks } from "@/hooks/useUserBooks";

type UseStatsPageControllerResult = {
  user: User | null;
  authLoading: boolean;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
  stats: ReadingStats;
  hasBooks: boolean;
  booksLoading: boolean;
  booksError: boolean;
  onRetryFetch: () => void;
};

export function useStatsPageController(): UseStatsPageControllerResult {
  const { user, loading: authLoading } = useAuth();
  const {
    data: userBooks,
    loading: booksLoading,
    isError: booksError,
    refetch,
  } = useUserBooks(user?.id ?? null);
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, navigate]);

  async function onLogout() {
    setIsLoggingOut(true);
    await Logout();
    setIsLoggingOut(false);
    navigate("/", { replace: true });
  }

  const stats = useMemo(() => computeReadingStats(userBooks), [userBooks]);
  const hasBooks = userBooks.length > 0;

  return {
    user,
    authLoading,
    isLoggingOut,
    onLogout,
    stats,
    hasBooks,
    booksLoading,
    booksError,
    onRetryFetch: refetch,
  };
}
