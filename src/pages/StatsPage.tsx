import HomeHeader from "@/features/home/components/HomeHeader";
import StatsDashboard from "@/features/stats/components/StatsDashboard";
import { useStatsPageController } from "@/features/stats/hooks/useStatsPageController";
import HomeLayout from "@/layouts/HomeLayout";

export default function StatsPage() {
  const {
    user,
    authLoading,
    isLoggingOut,
    onLogout,
    stats,
    hasBooks,
    booksLoading,
    booksError,
    onRetryFetch,
  } = useStatsPageController();

  if (authLoading) return null;

  return (
    <HomeLayout
      header={
        <HomeHeader
          user={user}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />
      }
    >
      <StatsDashboard
        stats={stats}
        hasBooks={hasBooks}
        loading={booksLoading}
        isError={booksError}
        onRetry={onRetryFetch}
      />
    </HomeLayout>
  );
}
