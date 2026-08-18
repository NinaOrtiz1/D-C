import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
dotenv.config({ path: ".env.local", override: false });

const configuredJwtSecret = process.env.JWT_SECRET;

if (!configuredJwtSecret) {
  throw new Error("JWT_SECRET no está configurado. Define la variable de entorno antes de iniciar el backend.");
}

export const JWT_SECRET = configuredJwtSecret;

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
