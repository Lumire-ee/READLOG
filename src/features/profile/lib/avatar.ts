import type { User } from "@supabase/supabase-js";
import type { OAuthProvider } from "@/features/profile/lib/accountDeletion";

function getString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function getObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getAvatarImageFromMetadata(metadata: Record<string, unknown>) {
  const topLevel =
    getString(metadata.avatar_url) ??
    getString(metadata.picture) ??
    getString(metadata.profile_image_url);
  if (topLevel) return topLevel;

  const kakaoAccount = getObject(metadata.kakao_account);
  const kakaoProfile = getObject(kakaoAccount?.profile);
  return getString(kakaoProfile?.profile_image_url);
}

function getUserBaseName(user: User | null) {
  if (!user) return null;

  const metadata = getObject(user.user_metadata) ?? {};
  return (
    getString(metadata.name) ??
    getString(metadata.full_name) ??
    getString(metadata.nickname) ??
    user.email?.split("@")[0] ??
    null
  );
}

export function getUserAvatarImageUrl(user: User | null) {
  const oauthProvider = getPrimaryOAuthProvider(user);

  const metadata = getObject(user?.user_metadata) ?? {};
  return oauthProvider !== null ? getAvatarImageFromMetadata(metadata) : null;
}

export function getPrimaryOAuthProvider(user: User | null): OAuthProvider | null {
  const providers = Array.isArray(user?.app_metadata.providers)
    ? user.app_metadata.providers
    : [];
  const primaryProvider = getString(user?.app_metadata.provider);

  if (primaryProvider === "google" || primaryProvider === "kakao") {
    return primaryProvider;
  }

  if (providers.includes("google")) return "google";
  if (providers.includes("kakao")) return "kakao";

  return null;
}

export function getUserTextAvatar(user: User | null) {
  if (!user) return "U";

  const rawName = getUserBaseName(user) ?? "";

  const initials = rawName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}

export function getUserEmail(user: User | null) {
  return user?.email ?? "";
}

export function resolveDisplayNickname(
  user: User | null,
  profileNickname: string | null,
) {
  const nickname = getString(profileNickname);
  if (nickname) return nickname;

  return getUserBaseName(user) ?? "사용자";
}

export function isEmailPasswordUser(user: User | null) {
  if (!user) return false;

  const primaryProvider = getString(user.app_metadata?.provider);
  const providers = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers
    : [];
  const hasEmailIdentity = Array.isArray(user.identities)
    ? user.identities.some((identity) => identity.provider === "email")
    : false;

  return (
    primaryProvider === "email" ||
    providers.includes("email") ||
    hasEmailIdentity
  );
}
