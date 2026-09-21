const configuredApiBase = import.meta.env["VITE_API_URL"] ?? "/api";

function resolveApiBase() {
  if (typeof window === "undefined" || !/^https?:\/\//i.test(configuredApiBase)) {
    return configuredApiBase;
  }

  const configuredUrl = new URL(configuredApiBase);
  const isLocalhostApi = ["localhost", "127.0.0.1", "0.0.0.0"].includes(configuredUrl.hostname);
  const isLocalhostPage = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (isLocalhostApi && !isLocalhostPage) {
    configuredUrl.hostname = window.location.hostname;
    return configuredUrl.toString().replace(/\/$/, "");
  }

  return configuredApiBase;
}

const rawApiBase = resolveApiBase();

export const API_REQUEST_TIMEOUT_MS = 15000;

export const API_BASE = rawApiBase.replace(/\/$/, "");

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = API_REQUEST_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}
