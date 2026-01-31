export function resolveAssetUrl(path?: string | null): string {
  if (!path) return "";

  // If already absolute
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";

  // If api base is absolute -> image must load from that backend origin
  if (apiBase.startsWith("http")) {
    try {
      const origin = new URL(apiBase).origin;
      return new URL(path, origin).toString();
    } catch {
      return path;
    }
  }

  // Same origin case
  return path;
}
