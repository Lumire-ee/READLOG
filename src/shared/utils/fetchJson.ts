export async function fetchJson<T>(
  url: RequestInfo | URL,
  init?: RequestInit,
  label?: string
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${label ?? "Request"} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
