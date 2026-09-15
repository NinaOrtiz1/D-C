import { afterEach, describe, expect, it } from "vitest";

import { escapeHtml, getAdminNotificationEmail, sendEmail } from "./emailService.js";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("email service", () => {
  it("escapa contenido controlado por usuarios", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("no intenta enviar si faltan credenciales del proveedor", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;

    await expect(
      sendEmail({ to: "admin@example.com", subject: "Test", html: "<p>Test</p>" }),
    ).resolves.toBe(false);
  });

  it("lee el destinatario administrativo configurado", () => {
    process.env.ADMIN_NOTIFICATION_EMAIL = "admin@example.com";
    expect(getAdminNotificationEmail()).toBe("admin@example.com");
  });
});