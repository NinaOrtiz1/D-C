import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../auth.js";
import { User } from "../models.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token de autenticación requerido." });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado." });
    }

    if (!user.activo) {
      return res.status(401).json({ success: false, message: "Usuario inactivo." });
    }

    (req as any).user = {
      id: String(user._id),
      role: user.rol ?? user.role ?? "cliente",
      email: user.correo ?? user.email,
      nombre: user.nombre ?? user.name,
    };

    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Token inválido o expirado." });
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = (req as any).user;

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción.",
      });
    }

    return next();
  };
}
