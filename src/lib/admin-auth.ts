export const ADMIN_AUTH_STORAGE_KEY = "dyc-admin";

export interface StoredAdminAuth {
  isAuthenticated?: boolean;
  token?: string;
  role?: string;
  rememberMe?: boolean;
  expiresAt?: number;
}

export interface StoredAdminPin {
  pin?: string;
  remember?: boolean;
}

export interface AdminSessionState {
  isAuthenticated: boolean;
  token?: string;
  role?: string;
  rememberMe: boolean;
  expiresAt?: number;
  remainingMinutes: number;
  expiresSoon: boolean;
}

export function readStoredAdminAuth(): StoredAdminAuth | null {
  if (typeof window === "undefined") return null;

  const storageCandidates = [window.localStorage, window.sessionStorage];

  for (const storage of storageCandidates) {
    const saved = storage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!saved) continue;

    try {
      const parsed = JSON.parse(saved) as StoredAdminAuth;
      if (parsed?.expiresAt && parsed.expiresAt <= Date.now()) {
        storage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      storage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  }

  return null;
}

export function saveStoredAdminAuth(token: string, role: string, rememberMe = true) {
  if (typeof window === "undefined") return;

  const payload: StoredAdminAuth = {
    isAuthenticated: true,
    role,
    rememberMe,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  };

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(payload));

  if (rememberMe) {
    window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } else {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  }
}

export function clearStoredAdminAuth() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

export function getAdminSessionState(): AdminSessionState | null {
  const auth = readStoredAdminAuth();
  if (!auth?.isAuthenticated) return null;

  const expiresAt = Number(auth.expiresAt ?? 0);
  const remainingMs = expiresAt > 0 ? expiresAt - Date.now() : 0;
  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000));

  return {
    isAuthenticated: Boolean(auth.isAuthenticated),
    ...(auth.role ? { role: auth.role } : {}),
    rememberMe: Boolean(auth.rememberMe),
    expiresAt,
    remainingMinutes,
    expiresSoon: remainingMinutes > 0 && remainingMinutes <= 30,
  };
}
