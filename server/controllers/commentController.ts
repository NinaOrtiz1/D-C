import type { Request, Response } from "express";

import { Comment } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

export async function createComment(req: Request, res: Response) {
  try {
    const comentario = String(req.body.comentario ?? req.body.comment ?? "").trim();
    if (!comentario) {
      return sendError(res, 400, "El comentario es obligatorio.");
    }

    const comment = await Comment.create({
      usuario: req.body.usuario || undefined,
      product: req.body.product || undefined,
      nombre: String(req.body.nombre ?? "").trim(),
      email: String(req.body.email ?? "").trim(),
      comentario,
      rating: Number(req.body.rating ?? 5),
      aprobado: false,
    });

    return sendSuccess(res, "Comentario enviado correctamente. Espera aprobación.", comment);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo crear el comentario.");
  }
}

export async function getComments(_req: Request, res: Response) {
  try {
    const comments = await Comment.find({}).populate("usuario", "nombre correo").sort({ createdAt: -1 });
    return sendSuccess(res, "Comentarios obtenidos.", comments);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener los comentarios.");
  }
}

export async function approveComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { aprobado: true, approved: true }, { new: true });
    if (!comment) return sendError(res, 404, "Comentario no encontrado.");
    return sendSuccess(res, "Comentario aprobado.", comment);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo aprobar el comentario.");
  }
}

export async function rejectComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { aprobado: false, approved: false }, { new: true });
    if (!comment) return sendError(res, 404, "Comentario no encontrado.");
    return sendSuccess(res, "Comentario rechazado.", comment);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo rechazar el comentario.");
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return sendError(res, 404, "Comentario no encontrado.");
    return sendSuccess(res, "Comentario eliminado.", comment);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo eliminar el comentario.");
  }
}
