import type { Request, Response } from "express";

import { comparePassword, hashPassword, signToken } from "../auth.js";
import { ActivityLog, LoginHistory, User } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

function getClientMetadata(req: Request) {
  return {
    ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
    userAgent: req.headers["user-agent"] || "unknown",
  };
}

export async function registerUser(req: Request, res: Response) {
  try {
    const nombre = String(req.body.nombre ?? req.body.name ?? "").trim();
    const correo = String(req.body.correo ?? req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const telefono = String(req.body.telefono ?? req.body.phone ?? "").trim();

    if (!nombre || !correo || !password) {
      return sendError(res, 400, "Nombre, correo y contraseña son obligatorios.");
    }

    const existingUser = await User.findOne({ correo: { $regex: new RegExp(`^${correo}$`, "i") } });
    if (existingUser) {
      return sendError(res, 409, "Ya existe un usuario con ese correo.");
    }

    const safePassword = await hashPassword(password);
    const user = await User.create({
      nombre,
      correo,
      email: correo,
      password: safePassword,
      rol: "cliente",
      role: "cliente",
      telefono,
      foto: req.body.foto || "",
      activo: true,
    });

    const token = signToken({ sub: String(user._id), role: user.rol, email: user.correo });

    await ActivityLog.create({
      usuario: user._id,
      accion: "CREATE",
      recurso: "User",
      recursoId: String(user._id),
      fecha: new Date(),
      ip: getClientMetadata(req).ip,
      userAgent: getClientMetadata(req).userAgent,
    });

    return sendSuccess(res, "Usuario registrado correctamente.", {
      user: { ...user.toObject(), password: undefined },
      token,
    });
  } catch (error) {
    console.error("registerUser", error);
    return sendError(res, 500, "No se pudo registrar el usuario.");
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const correo = String(req.body.correo ?? req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const metadata = getClientMetadata(req);

    if (!correo || !password) {
      return sendError(res, 400, "Correo y contraseña son obligatorios.");
    }

    const user = await User.findOne({ correo: { $regex: new RegExp(`^${correo}$`, "i") } });

    if (!user) {
      await LoginHistory.create({
        usuario: null,
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        fecha: new Date(),
        exitoso: false,
      });
      return sendError(res, 401, "Credenciales incorrectas.");
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      await LoginHistory.create({
        usuario: user._id,
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        fecha: new Date(),
        exitoso: false,
      });
      return sendError(res, 401, "Credenciales incorrectas.");
    }

    if (!user.activo) {
      return sendError(res, 401, "Usuario inactivo.");
    }

    user.ultimoLogin = new Date();
    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ sub: String(user._id), role: user.rol, email: user.correo });

    await LoginHistory.create({
      usuario: user._id,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
      fecha: new Date(),
      exitoso: true,
    });

    await ActivityLog.create({
      usuario: user._id,
      accion: "LOGIN",
      recurso: "Auth",
      recursoId: String(user._id),
      fecha: new Date(),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return sendSuccess(res, "Inicio de sesión correcto.", { user: safeUser, token });
  } catch (error) {
    console.error("loginUser", error);
    return sendError(res, 500, "No se pudo iniciar sesión.");
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (user) {
      await ActivityLog.create({
        usuario: user.id,
        accion: "LOGOUT",
        recurso: "Auth",
        recursoId: user.id,
        fecha: new Date(),
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      });
    }

    return sendSuccess(res, "Sesión cerrada correctamente.", null);
  } catch (error) {
    console.error("logoutUser", error);
    return sendError(res, 500, "No se pudo cerrar la sesión.");
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return sendError(res, 401, "No autenticado.");

    const currentUser = await User.findById(user.id).select("-password");
    if (!currentUser) return sendError(res, 404, "Usuario no encontrado.");

    return sendSuccess(res, "Usuario actual obtenido.", currentUser);
  } catch (error) {
    console.error("getCurrentUser", error);
    return sendError(res, 500, "No se pudo obtener el usuario.");
  }
}
