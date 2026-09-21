import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { comparePassword, hashPassword, signToken, verifyAdminPinAccess } from "../auth.js";
import { ActivityLog, LoginHistory, User } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
    email?: string;
    nombre?: string;
  };
}

const managedRoles = new Set(["admin", "editor", "cliente", "plus"]);

function getClientMetadata(req: Request) {
  return {
    ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
    userAgent: req.headers["user-agent"] || "unknown",
  };
}

function hasAdminPinAccess(req: Request) {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((value) => value.trim().split("="))
    .find(([name]) => name === "admin_pin_access")?.[1];
  if (!cookie) return false;
  try {
    return verifyAdminPinAccess(cookie);
  } catch {
    return false;
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const nombre = String(req.body.nombre ?? req.body.name ?? "").trim();
    const correo = String(req.body.correo ?? req.body.email ?? "")
      .trim()
      .toLowerCase();
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

    res.cookie("auth_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
  const startedAt = Date.now();
  let outcome = "error";

  console.info("[AUTH_LOGIN_START]", { method: req.method, path: req.originalUrl });

  try {
    const correo = String(req.body.correo ?? req.body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password ?? "");
    const metadata = getClientMetadata(req);

    if (!correo || !password) {
      outcome = "invalid_request";
      return sendError(res, 400, "Correo y contraseña son obligatorios.");
    }

    const user = await User.findOne({ correo }).maxTimeMS(10000);

    if (!user) {
      await LoginHistory.create({
        usuario: null,
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        fecha: new Date(),
        exitoso: false,
      });
      outcome = "invalid_credentials";
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
      outcome = "invalid_credentials";
      return sendError(res, 401, "Credenciales incorrectas.");
    }

    if (!user.activo) {
      outcome = "inactive_user";
      return sendError(res, 401, "Usuario inactivo.");
    }

    const userRole = user.rol ?? user.role;
    if (userRole === "admin" && !hasAdminPinAccess(req)) {
      outcome = "admin_pin_required";
      return sendError(res, 403, "Se requiere validar el PIN administrativo.");
    }

    const loginDate = new Date();
    await User.updateOne(
      { _id: user._id },
      { $set: { ultimoLogin: loginDate, lastLogin: loginDate } },
    ).maxTimeMS(10000);

    const token = signToken({ sub: String(user._id), role: user.rol, email: user.correo });

    res.cookie("auth_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await Promise.all([
      LoginHistory.create({
        usuario: user._id,
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        fecha: loginDate,
        exitoso: true,
      }),
      ActivityLog.create({
        usuario: user._id,
        accion: "LOGIN",
        recurso: "Auth",
        recursoId: String(user._id),
        fecha: loginDate,
        ip: metadata.ip,
        userAgent: metadata.userAgent,
      }),
    ]);

    const safeUser = user.toObject();
    delete safeUser.password;

    outcome = "success";
    return sendSuccess(res, "Inicio de sesión correcto.", { user: safeUser, token });
  } catch (error) {
    console.error("loginUser", error);
    return sendError(res, 500, "No se pudo iniciar sesión.");
  } finally {
    console.info("[AUTH_LOGIN_END]", { durationMs: Date.now() - startedAt, outcome });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    const user = (req as AuthenticatedRequest).user;

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
    const user = (req as AuthenticatedRequest).user;
    if (!user) return sendError(res, 401, "No autenticado.");

    const currentUser = await User.findById(user.id).select("-password");
    if (!currentUser) return sendError(res, 404, "Usuario no encontrado.");

    return sendSuccess(res, "Usuario actual obtenido.", currentUser);
  } catch (error) {
    console.error("getCurrentUser", error);
    return sendError(res, 500, "No se pudo obtener el usuario.");
  }
}

function serializeUser(user: { toObject: () => Record<string, unknown> } | null | undefined) {
  if (!user) return null;
  const data = user.toObject();
  delete data.password;
  return data;
}

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    return sendSuccess(res, "Usuarios obtenidos.", users);
  } catch (error) {
    console.error("getUsers", error);
    return sendError(res, 500, "No se pudieron obtener los usuarios.");
  }
}

export async function createManagedUser(req: Request, res: Response) {
  try {
    const nombre = String(req.body?.nombre ?? req.body?.name ?? "").trim();
    const correo = String(req.body?.correo ?? req.body?.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password ?? "");
    const rol = String(req.body?.rol ?? req.body?.role ?? "cliente").trim();

    if (!nombre || !correo || !password) {
      return sendError(res, 400, "Nombre, correo y contraseña son obligatorios.");
    }
    if (!managedRoles.has(rol)) return sendError(res, 400, "El rol no es válido.");
    if (password.length < 8) {
      return sendError(res, 400, "La contraseña debe tener al menos 8 caracteres.");
    }
    if (await User.findOne({ correo })) {
      return sendError(res, 409, "Ya existe un usuario con ese correo.");
    }

    const user = await User.create({
      nombre,
      correo,
      email: correo,
      password: await hashPassword(password),
      rol,
      role: rol,
      telefono: String(req.body?.telefono ?? req.body?.phone ?? "").trim(),
      documento: String(req.body?.documento ?? "").trim(),
      fechaNacimiento: req.body?.fechaNacimiento || null,
      direccion: String(req.body?.direccion ?? "").trim(),
      ciudad: String(req.body?.ciudad ?? "").trim(),
      estado: String(req.body?.estado ?? "").trim(),
      codigoPostal: String(req.body?.codigoPostal ?? "").trim(),
      empresa: String(req.body?.empresa ?? "").trim(),
      notas: String(req.body?.notas ?? "").trim(),
      activo: req.body?.activo !== false,
    });

    return sendSuccess(res, "Usuario creado.", serializeUser(user));
  } catch (error) {
    console.error("createManagedUser", error);
    return sendError(res, 500, "No se pudo crear el usuario.");
  }
}

export async function updateManagedUser(req: Request, res: Response) {
  try {
    if (!isValidObjectId(req.params.id))
      return sendError(res, 400, "Identificador de usuario inválido.");
    const currentUser = (req as AuthenticatedRequest).user;
    const requestedRole = req.body?.rol ?? req.body?.role;
    if (requestedRole !== undefined && !managedRoles.has(String(requestedRole))) {
      return sendError(res, 400, "El rol no es válido.");
    }
    if (currentUser?.id === req.params.id && req.body?.activo === false) {
      return sendError(res, 400, "No puedes desactivar tu propio usuario.");
    }

    const update: Record<string, unknown> = {};
    for (const field of [
      "nombre",
      "telefono",
      "foto",
      "activo",
      "documento",
      "fechaNacimiento",
      "direccion",
      "ciudad",
      "estado",
      "codigoPostal",
      "empresa",
      "notas",
    ]) {
      if (req.body?.[field] !== undefined) update[field] = req.body[field];
    }
    if (requestedRole !== undefined) {
      update.rol = String(requestedRole);
      update.role = String(requestedRole);
    }
    if (req.body?.password) {
      if (String(req.body.password).length < 8) {
        return sendError(res, 400, "La contraseña debe tener al menos 8 caracteres.");
      }
      update.password = await hashPassword(String(req.body.password));
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) return sendError(res, 404, "Usuario no encontrado.");
    return sendSuccess(res, "Usuario actualizado.", serializeUser(user));
  } catch (error) {
    console.error("updateManagedUser", error);
    return sendError(res, 500, "No se pudo actualizar el usuario.");
  }
}

export async function deleteManagedUser(req: Request, res: Response) {
  try {
    if (!isValidObjectId(req.params.id))
      return sendError(res, 400, "Identificador de usuario inválido.");
    const currentUser = (req as AuthenticatedRequest).user;
    if (currentUser?.id === req.params.id) {
      return sendError(res, 400, "No puedes eliminar tu propio usuario.");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 404, "Usuario no encontrado.");
    return sendSuccess(res, "Usuario eliminado.", serializeUser(user));
  } catch (error) {
    console.error("deleteManagedUser", error);
    return sendError(res, 500, "No se pudo eliminar el usuario.");
  }
}
