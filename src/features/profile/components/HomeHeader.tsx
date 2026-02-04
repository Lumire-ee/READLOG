import { Button } from "@/components/ui/button";

type HomeHeaderProps = {
  nickname?: string | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

export default function HomeHeader({
  nickname,
  onLogout,
  isLoggingOut = false,
}: HomeHeaderProps) {
  const displayName = nickname?.trim() || "사용자";

  return (
    <header className="flex w-full items-center justify-end">
      <h1 className="typo-heading-md text-text-primary">{displayName} 님</h1>
      <Button variant="authText" onClick={onLogout} disabled={isLoggingOut}>
        로그아웃
      </Button>
    </header>
  );
}
