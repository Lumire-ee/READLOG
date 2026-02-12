import crypto from "crypto";

export const THUMB_BUCKET = process.env.THUMB_BUCKET || "thumbnails";

const ALLOW_HOSTS = [
  "books.google.com",
  "books.googleusercontent.com",
  "lh3.googleusercontent.com",
  "shopping-phinf.pstatic.net",
  "bookthumb-phinf.pstatic.net",
  "ssl.pstatic.net",
];

export function assertAllowedSrc(src) {
  let url;
  try {
    url = new URL(src);
  } catch {
    throw new Error("invalid_src");
  }

  const host = url.hostname.toLowerCase();
  const allowed = ALLOW_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  if (!allowed) throw new Error("src_not_allowed");

  // http도 허용하되 서버에서 받아오므로 mixed-content 영향 없음
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("invalid_protocol");
  }

  return url.toString();
}

export function makeThumbPath(src, w) {
  const width = Number.isFinite(w) ? Math.max(0, Math.min(1000, w)) : 0;
  const hash = crypto
    .createHash("sha256")
    .update(src)
    .digest("hex")
    .slice(0, 32);
  const suffix = width ? `_w${width}` : "";
  return `thumb/${hash}${suffix}`;
}
