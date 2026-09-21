import { beforeEach, describe, expect, it } from "vitest";

import {
  ADMIN_AUTH_STORAGE_KEY,
  clearStoredAdminAuth,
  getAdminSessionState,
  readStoredAdminAuth,
  saveStoredAdminAuth,
} from "./admin-auth";

describe("admin auth storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("guarda la sesión y la recupera cuando aún no expira", () => {
    saveStoredAdminAuth("token-abc", "admin", true);

    const session = readStoredAdminAuth();

    expect(session?.token).toBeUndefined();
    expect(session?.role).toBe("admin");
    expect(session?.isAuthenticated).toBe(true);
  });

  it("borra la sesión si el token venció", () => {
    const expired = {
      isAuthenticated: true,
      role: "admin",
      rememberMe: true,
      expiresAt: Date.now() - 1000,
    };

    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(expired));

    expect(readStoredAdminAuth()).toBeNull();
    expect(window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY)).toBeNull();
  });

  it("limpia ambas memorias de sesión", () => {
    saveStoredAdminAuth("token-session", "admin", false);
    window.localStorage.setItem("other-key", "value");

    clearStoredAdminAuth();

    expect(readStoredAdminAuth()).toBeNull();
    expect(window.localStorage.getItem("other-key")).toBe("value");
  });

  it("detecta sesión activa y cercana a expirar para UI premium", () => {
    const future = Date.now() + 1000 * 60 * 60;
    window.localStorage.setItem(
      ADMIN_AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        role: "admin",
        rememberMe: true,
        expiresAt: future,
      }),
    );

    const state = getAdminSessionState();

    expect(state?.isAuthenticated).toBe(true);
    expect(state?.expiresSoon).toBe(false);
    expect(state?.remainingMinutes).toBeGreaterThanOrEqual(55);
  });
});
