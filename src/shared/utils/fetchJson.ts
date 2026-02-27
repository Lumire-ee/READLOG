export async function fetchJson<T>(
  url: RequestInfo | URL,
  init?: RequestInit,
  label?: string,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${label ?? "Request"} failed: ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
