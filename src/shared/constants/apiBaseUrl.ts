const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveApiBaseUrl(): string {
  if (rawApiBaseUrl) {
    try {
      return new URL(rawApiBaseUrl).toString();
    } catch {
      throw new Error("API 서버 주소 설정이 올바르지 않습니다.");
    }
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  throw new Error("API 서버 주소 환경변수가 필요합니다.");
}

export const API_BASE_URL = resolveApiBaseUrl();
