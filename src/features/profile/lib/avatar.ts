import type { User } from "@supabase/supabase-js";

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

export function getUserAvatarImageUrl(user: User | null) {
  const providers = Array.isArray(user?.app_metadata.providers)
    ? user?.app_metadata.providers
    : [];
  const primaryProvider = getString(user?.app_metadata.provider);
  const oauthProvider =
    primaryProvider === "google" || primaryProvider === "kakao"
      ? primaryProvider
      : providers.includes("google")
        ? "google"
        : providers.includes("kakao")
          ? "kakao"
          : null;

  const metadata = getObject(user?.user_metadata) ?? {};
  return oauthProvider !== null ? getAvatarImageFromMetadata(metadata) : null;
}

export function getUserTextAvatar(user: User | null) {
  if (!user) return "U";

  const metadata = getObject(user.user_metadata) ?? {};
  const rawName =
    getString(metadata.name) ??
    getString(metadata.full_name) ??
    getString(metadata.nickname) ??
    user.email?.split("@")[0] ??
    "";

  const initials = rawName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}
