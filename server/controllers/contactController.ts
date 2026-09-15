import type { Request, Response } from "express";

import { Contact } from "../models.js";
import {
  escapeHtml,
  getAdminNotificationEmail,
  sendEmail,
} from "../services/emailService.js";
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

    const notificationEmail = getAdminNotificationEmail();
    if (notificationEmail) {
      void sendEmail({
        to: notificationEmail,
        subject: `Nuevo contacto de ${nombre}`,
        replyTo: correo || undefined,
        html: `<h2>Nuevo mensaje de contacto</h2><p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p><p><strong>Correo:</strong> ${escapeHtml(correo || "No proporcionado")}</p><p><strong>Teléfono:</strong> ${escapeHtml(String(req.body.telefono ?? req.body.phone ?? "No proporcionado"))}</p><p>${escapeHtml(mensaje)}</p>`,
      }).catch((error) => console.error("No se pudo enviar la notificación de contacto", error));
    }

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
