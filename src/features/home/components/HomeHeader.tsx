import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const avatarImageUrl = getUserAvatarImageUrl(user);
  const textAvatar = getUserTextAvatar(user);
  const email = getUserEmail(user);
  const { data: profileNickname } = useProfileNickname(user?.id ?? null);
  const displayNickname = resolveDisplayNickname(user, profileNickname ?? null);

  return (
    <>
      <header className="flex w-full items-center justify-between gap-4">
        <Link to="/" className="text-text-primary typo-title-md">
          BookLog
        </Link>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="iconGhost"
                size="icon-sm"
                aria-label="프로필 메뉴 열기"
                className="rounded-full"
              >
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

