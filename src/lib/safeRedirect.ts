// only allow redirects to our own pages (prevents open-redirect attacks)
export function safeRedirect(path: string | null | undefined, fallback = "/"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
