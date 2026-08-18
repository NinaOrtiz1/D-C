import type { Request, Response } from "express";

import { Contact } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

export async function createContact(req: Request, res: Response) {
  try {
    const nombre = String(req.body.nombre ?? req.body.name ?? "").trim();
    const correo = String(req.body.correo ?? req.body.email ?? "").trim();
    const mensaje = String(req.body.mensaje ?? req.body.message ?? "").trim();

    if (!nombre || !mensaje) {
      return sendError(res, 400, "Nombre y mensaje son obligatorios.");
    }

    const contact = await Contact.create({
      nombre,
      correo,
      telefono: String(req.body.telefono ?? req.body.phone ?? ""),
      mensaje,
      origen: "web",
      leido: false,
    });

    return sendSuccess(res, "Mensaje de contacto guardado correctamente.", contact);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo guardar el mensaje.");
  }
}

export async function getContacts(_req: Request, res: Response) {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return sendSuccess(res, "Mensajes obtenidos.", contacts);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener los mensajes.");
  }
}

export async function markContactRead(req: Request, res: Response) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { leido: true, read: true, status: "leido" },
      { new: true },
    );

    if (!contact) return sendError(res, 404, "Mensaje no encontrado.");
    return sendSuccess(res, "Mensaje marcado como leído.", contact);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo actualizar el mensaje.");
  }
}

export async function deleteContact(req: Request, res: Response) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return sendError(res, 404, "Mensaje no encontrado.");
    return sendSuccess(res, "Mensaje eliminado.", contact);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo eliminar el mensaje.");
  }
}
