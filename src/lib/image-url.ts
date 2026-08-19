export function versionedImageUrl(src: string, version?: string | number) {
  if (!src || !version) return src;

  try {
    const url = new URL(src, window.location.origin);
    url.searchParams.set("v", String(version));
    return url.toString();
  } catch {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}v=${encodeURIComponent(String(version))}`;
  }
}