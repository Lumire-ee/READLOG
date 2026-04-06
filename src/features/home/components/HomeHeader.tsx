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
import ThemeToggleButton from "@/features/home/components/ThemeToggleButton";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import { useProfileNickname } from "@/features/profile/hooks/useProfileNickname";
import {
  getUserAvatarImageUrl,
  getUserEmail,
  getUserTextAvatar,
  resolveDisplayNickname,
} from "@/features/profile/lib/avatar";
import {
  clearAccountDeletePending,
  hasFreshAccountDeletePending,
} from "@/features/profile/lib/accountDeletion";
import { cn } from "@/lib/utils";

type HomeHeaderProps = {
  user: User | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

function headerNavLinkClass(isActive: boolean): string {
  return cn(
    "typo-label-sm shrink-0 rounded-md px-2 py-1 transition-colors sm:typo-label-md sm:px-3 sm:py-1.5",
    isActive
      ? "text-text-primary"
      : "text-text-secondary hover:text-text-primary",
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
  const shouldResumeDeleteFlow = Boolean(user) && hasFreshAccountDeletePending();

  return (
    <>
      <header className="relative flex w-full items-center justify-between gap-1.5 sm:gap-3">
        <div className="flex items-center">
          <Link
            to="/home"
            className="typo-heading-md sm:typo-heading-lg text-accent-indigo shrink-0"
          >
            BookLog
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 p-0.5 sm:static sm:ml-6 sm:translate-x-0 sm:gap-4 sm:p-1"
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

        <div className="flex shrink-0 items-center justify-end gap-2">
          <ThemeToggleButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="iconGhost"
                size="icon-lg"
                aria-label="프로필 메뉴 열기"
                className="size-8 rounded-full sm:size-10"
              >
                {avatarImageUrl ? (
                  <img
                    src={avatarImageUrl}
                    alt="User avatar"
                    className="border-border-default size-8 rounded-full border object-cover sm:size-10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="bg-bg-elevated text-text-primary border-border-default flex size-8 items-center justify-center rounded-full border text-xs font-semibold sm:size-10 sm:text-sm">
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

      {user && (isEditModalOpen || shouldResumeDeleteFlow) ? (
        <EditProfileModal
          open={isEditModalOpen || shouldResumeDeleteFlow}
          onOpenChange={(nextOpen) => {
            setIsEditModalOpen(nextOpen);
            if (!nextOpen) {
              clearAccountDeletePending();
            }
          }}
          user={user}
          currentNickname={displayNickname}
        />
      ) : null}
    </>
  );
}
