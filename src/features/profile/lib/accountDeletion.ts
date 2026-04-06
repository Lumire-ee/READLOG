export type OAuthProvider = "google" | "kakao";

export const ACCOUNT_DELETE_PENDING_STORAGE_KEY = "ACCOUNT_DELETE_PENDING";
export const ACCOUNT_DELETE_REAUTH_WINDOW_MS = 5 * 60 * 1000;

type AccountDeletePendingPayload = {
  provider: OAuthProvider;
  requestedAt: number;
};

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function setAccountDeletePending(provider: OAuthProvider) {
  if (!canUseSessionStorage()) return;

  const payload: AccountDeletePendingPayload = {
    provider,
    requestedAt: Date.now(),
  };
  window.sessionStorage.setItem(
    ACCOUNT_DELETE_PENDING_STORAGE_KEY,
    JSON.stringify(payload),
  );
}

export function clearAccountDeletePending() {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(ACCOUNT_DELETE_PENDING_STORAGE_KEY);
}

export function getAccountDeletePending(): AccountDeletePendingPayload | null {
  if (!canUseSessionStorage()) return null;

  const raw = window.sessionStorage.getItem(ACCOUNT_DELETE_PENDING_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AccountDeletePendingPayload>;
    const provider = parsed.provider;
    const requestedAt = parsed.requestedAt;

    if (
      (provider !== "google" && provider !== "kakao") ||
      typeof requestedAt !== "number" ||
      !Number.isFinite(requestedAt)
    ) {
      clearAccountDeletePending();
      return null;
    }

    return { provider, requestedAt };
  } catch {
    clearAccountDeletePending();
    return null;
  }
}

export function hasFreshAccountDeletePending(now = Date.now()) {
  const pending = getAccountDeletePending();
  if (!pending) return false;

  if (now - pending.requestedAt > ACCOUNT_DELETE_REAUTH_WINDOW_MS) {
    clearAccountDeletePending();
    return false;
  }

  return true;
}

export function getFreshAccountDeletePending(
  provider?: OAuthProvider | null,
  now = Date.now(),
) {
  const pending = getAccountDeletePending();
  if (!pending) return null;

  if (now - pending.requestedAt > ACCOUNT_DELETE_REAUTH_WINDOW_MS) {
    clearAccountDeletePending();
    return null;
  }

  if (provider && pending.provider !== provider) {
    clearAccountDeletePending();
    return null;
  }

  return pending;
}

export function isRecentSignIn(
  lastSignInAt: string | null | undefined,
  now = Date.now(),
) {
  if (!lastSignInAt) return false;

  const signInTime = new Date(lastSignInAt).getTime();
  if (!Number.isFinite(signInTime)) return false;

  return now - signInTime <= ACCOUNT_DELETE_REAUTH_WINDOW_MS;
}
