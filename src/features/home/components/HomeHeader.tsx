import { Button } from "@/components/ui/button";
import {
  getUserAvatarImageUrl,
  getUserTextAvatar,
} from "@/features/profile/lib/avatar";
import type { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

type HomeHeaderProps = {
  user: User | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

export default function HomeHeader({
  user,
  onLogout,
  isLoggingOut = false,
}: HomeHeaderProps) {
  const avatarImageUrl = getUserAvatarImageUrl(user);
  const textAvatar = getUserTextAvatar(user);

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <Link to="/" className="text-text-primary typo-title-md">
        BookLog
      </Link>

      <div className="flex items-center justify-end gap-3">
        {avatarImageUrl ? (
          <img
            src={avatarImageUrl}
            alt="User avatar"
            className="border-border-default size-8 rounded-full border object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="bg-bg-elevated text-text-primary border-border-default flex size-8 items-center justify-center rounded-full border text-sm font-semibold">
            {textAvatar}
          </div>
        )}

        <Button
          type="button"
          variant="iconGhost"
          size="icon-sm"
          aria-label="Logout"
          disabled={isLoggingOut}
          onClick={onLogout}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}

