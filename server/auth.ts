import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import "./config.js";

const configuredJwtSecret = process.env.JWT_SECRET?.trim() ?? "";

if (!configuredJwtSecret || configuredJwtSecret.trim() === "") {
  throw new Error(
    "JWT_SECRET no está configurado. Define la variable de entorno antes de iniciar el backend.",
  );
}

export const JWT_SECRET = configuredJwtSecret;

const ADMIN_PIN_ACCESS_PURPOSE = "admin-pin-access";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string; role: string; email?: string };
}

export function signAdminPinAccess() {
  return jwt.sign({ purpose: ADMIN_PIN_ACCESS_PURPOSE }, JWT_SECRET, { expiresIn: "30m" });
}

export function verifyAdminPinAccess(token: string) {
  const payload = jwt.verify(token, JWT_SECRET) as { purpose?: string };
  return payload.purpose === ADMIN_PIN_ACCESS_PURPOSE;
}
