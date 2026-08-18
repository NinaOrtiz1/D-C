import type { Request, Response } from "express";

import { SiteConfig, SocialNetwork } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

export async function getSiteConfig(_req: Request, res: Response) {
  try {
    const config = await SiteConfig.findOne() || await SiteConfig.create({
      nombreEmpresa: "D&C Innovación",
      logo: "",
      telefono: "618 444 4686",
      correo: "contacto@dcinnovacion.mx",
      direccion: "Durango, México",
      colorPrincipal: "#7b1e3a",
      colorSecundario: "#f4e7eb",
      descripcion: "Productos personalizados con grabado láser, impresión 3D y diseño a medida.",
    });

    return sendSuccess(res, "Configuración del sitio obtenida.", config);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo obtener la configuración del sitio.");
  }
}

export async function updateSiteConfig(req: Request, res: Response) {
  try {
    const config = await SiteConfig.findOneAndUpdate(
      {},
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true, upsert: true },
    );

    return sendSuccess(res, "Configuración actualizada.", config);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo actualizar la configuración.");
  }
}

export async function getSocialNetworks(_req: Request, res: Response) {
  try {
    const socials = await SocialNetwork.find({ activo: true }).sort({ createdAt: -1 });
    return sendSuccess(res, "Redes sociales obtenidas.", socials);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener las redes sociales.");
  }
}

export async function upsertSocialNetworks(req: Request, res: Response) {
  try {
    const body = Array.isArray(req.body) ? req.body : [req.body];

    const results = await Promise.all(
      body.map(async (item) => {
        const nombre = String(item?.nombre ?? item?.platform ?? "").trim();
        const url = String(item?.url ?? item?.enlace ?? "").trim();
        if (!nombre || !url) return null;

        return SocialNetwork.findOneAndUpdate(
          { nombre },
          { nombre, url, activo: true },
          { new: true, upsert: true },
        );
      }),
    );

    return sendSuccess(res, "Redes sociales guardadas.", results.filter(Boolean));
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo guardar la configuración de redes sociales.");
  }
}
