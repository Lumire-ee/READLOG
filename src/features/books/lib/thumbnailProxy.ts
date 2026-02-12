import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";

export function toProxiedThumbnailSrc(src: string | null | undefined, w = 0) {
  if (!src) return "";
  const url = new URL("/api/thumb", API_BASE_URL);
  url.searchParams.set("src", src);
  if (w > 0) url.searchParams.set("w", String(w));
  return url.toString();
}
