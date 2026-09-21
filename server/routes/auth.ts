import { Router, type Request, type Response } from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { signAdminPinAccess, verifyAdminPinAccess } from "../auth.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendError, sendSuccess } from "../utils/api.js";

const router = Router();

const pinAttempts = new Map<string, { failures: number; blockedUntil: number }>();
const PIN_MAX_FAILURES = 5;
const PIN_BLOCK_MS = 15 * 60 * 1000;

function getClientKey(req: Request) {
  return String(req.ip || req.headers["x-forwarded-for"] || "unknown");
}

function setAdminPinCookie(res: Response) {
  res.cookie("admin_pin_access", signAdminPinAccess(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60 * 1000,
  });
}

function validateAdminPin(req: Request, res: Response, invalidStatus: number) {
  const key = getClientKey(req);
  const state = pinAttempts.get(key);
  if (state?.blockedUntil && state.blockedUntil > Date.now()) {
    return sendError(res, 429, "Demasiados intentos. Intenta nuevamente más tarde.");
  }

  const configuredPin = process.env.ADMIN_PIN?.trim();
  const submittedPin = typeof req.body?.pin === "string" ? req.body.pin : "";
  if (!configuredPin) return sendError(res, 500, "El PIN administrativo no está configurado.");

  if (submittedPin !== configuredPin) {
    const failures = (state?.failures ?? 0) + 1;
    pinAttempts.set(key, {
      failures,
      blockedUntil: failures >= PIN_MAX_FAILURES ? Date.now() + PIN_BLOCK_MS : 0,
    });
    console.warn("[ADMIN_PIN_FAILED]", { ip: getClientKey(req), failures });
    return invalidStatus === 200
      ? sendSuccess(res, "PIN incorrecto.", { valid: false })
      : sendError(res, invalidStatus, "PIN incorrecto.");
  }

  pinAttempts.delete(key);
  setAdminPinCookie(res);
  console.info("[ADMIN_PIN_SUCCESS]", { ip: getClientKey(req) });
  return sendSuccess(res, "PIN validado correctamente.", { valid: true });
}

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-pin", (req, res) => {
  return validateAdminPin(req, res, 200);
});
router.post("/admin/verify-pin", (req, res) => {
  return validateAdminPin(req, res, 401);
});
router.post("/logout", (req, res) => {
  res.clearCookie("admin_pin_access", { path: "/" });
  res.clearCookie("auth_token", { path: "/" });
  return logoutUser(req, res);
});
router.get("/me", authMiddleware, getCurrentUser);

export default router;
