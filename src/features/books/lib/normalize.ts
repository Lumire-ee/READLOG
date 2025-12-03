export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

export function normalizeText(value: string | undefined | null): string {
  if (!value) return "";
  return stripHtml(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function normalizeCompactText(value: string | undefined | null): string {
  return normalizeText(value).replace(/\s+/g, "");
}
