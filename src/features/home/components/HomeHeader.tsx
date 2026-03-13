import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { LogOut, UserPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import { useProfileNickname } from "@/features/profile/hooks/useProfileNickname";
import {
  getUserAvatarImageUrl,
  getUserEmail,
  getUserTextAvatar,
  resolveDisplayNickname,
} from "@/features/profile/lib/avatar";
import { cn } from "@/lib/utils";

type HomeHeaderProps = {
  user: User | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

function headerNavLinkClass(isActive: boolean): string {
  return cn(
    "rounded-lg px-3 py-1.5 typo-label-sm transition-colors",
    isActive
      ? "bg-bg-surface text-text-primary"
      : "text-text-secondary hover:bg-bg-surface hover:text-text-primary",
  );
}

export default function HomeHeader({
  user,
  onLogout,
  isLoggingOut = false,
}: HomeHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const avatarImageUrl = getUserAvatarImageUrl(user);
  const textAvatar = getUserTextAvatar(user);
  const email = getUserEmail(user);
  const { data: profileNickname } = useProfileNickname(user?.id ?? null);
  const displayNickname = resolveDisplayNickname(user, profileNickname ?? null);

  return (
    <>
      <header className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link to="/home" className="typo-heading-sm text-text-primary">
            BookLog
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="border-border-default bg-bg-elevated flex items-center gap-1 rounded-xl border p-1"
          >
            <NavLink
              to="/home"
              end
              className={({ isActive }) => headerNavLinkClass(isActive)}
            >
              홈
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) => headerNavLinkClass(isActive)}
            >
              통계
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="iconGhost"
                size="icon-lg"
                aria-label="프로필 메뉴 열기"
                className="rounded-full"
              >
                {avatarImageUrl ? (
                  <img
                    src={avatarImageUrl}
                    alt="User avatar"
                    className="border-border-default size-10 rounded-full border object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="bg-bg-elevated text-text-primary border-border-default flex size-10 items-center justify-center rounded-full border text-sm font-semibold">
                    {textAvatar}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-72 p-0">
              <div className="typo-label-sm text-text-primary px-2 pt-4 text-center">
                {email}
              </div>

              <div className="flex flex-col items-center gap-4 px-4 py-4">
                {avatarImageUrl ? (
                  <img
                    src={avatarImageUrl}
                    alt="User avatar"
                    className="border-border-default size-16 rounded-full border object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="bg-bg-elevated text-text-primary border-border-default flex size-16 items-center justify-center rounded-full border text-lg font-semibold">
                    {textAvatar}
                  </div>
                )}

                <p className="typo-body-md text-text-primary text-center">
                  안녕하세요, {displayNickname}님
                </p>

                <div className="w-full space-y-2">
                  <DropdownMenuItem
                    className="border-border-default hover:bg-bg-surface-hover focus:bg-bg-surface-hover typo-label-sm h-9 justify-center gap-1.5 rounded-xl border"
                    onSelect={() => setIsEditModalOpen(true)}
                  >
                    <UserPen className="size-4" />
                    정보 수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    className="border-border-default hover:bg-bg-surface-hover focus:bg-bg-surface-hover typo-label-sm hover:text-accent-red focus:text-accent-red h-9 justify-center gap-1.5 rounded-xl border"
                    onSelect={() => {
                      // TODO: "/" 리다이렉트
                      onLogout();
                    }}
                  >
                    <LogOut className="size-4" />
                    로그아웃
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {user && isEditModalOpen ? (
        <EditProfileModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={user}
          currentNickname={displayNickname}
        />
      ) : null}
    </>
  );
}
