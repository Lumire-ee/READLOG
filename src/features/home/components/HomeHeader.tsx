import { useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { LogOut, PencilLine } from "lucide-react";
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

            <DropdownMenuContent className="w-64">
              <div className="flex items-center gap-3 px-2 py-2">
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
                <div className="min-w-0">
                  <p className="typo-label-md text-text-primary truncate">
                    {displayNickname}
                  </p>
                  <p className="typo-label-sm text-text-secondary truncate">
                    {email}
                  </p>
                </div>
              </div>

              <div className="border-border-default my-1 border-t" />

              <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>
                <PencilLine className="size-4" />
                정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoggingOut}
                className="hover:text-accent-red focus:text-accent-red"
                onSelect={() => {
                  // TODO: "/" 리다이렉트
                  onLogout();
                }}
              >
                <LogOut className="size-4" />
                로그아웃
              </DropdownMenuItem>
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
