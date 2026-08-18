import { Router } from "express";

import { getDashboardStats } from "../controllers/dashboardController.js";
import { createComment, approveComment, deleteComment, getComments, rejectComment } from "../controllers/commentController.js";
import { createContact, deleteContact, getContacts, markContactRead } from "../controllers/contactController.js";
import { getSiteConfig, getSocialNetworks, updateSiteConfig, upsertSocialNetworks } from "../controllers/siteController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { Banner, Category, FAQ, News, Product, Slider, SocialNetwork } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

const router = Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["admin", "editor"]), getDashboardStats);

router.get("/site-config", getSiteConfig);
router.put("/site-config", authMiddleware, roleMiddleware(["admin", "editor"]), updateSiteConfig);

router.get("/socials", getSocialNetworks);
router.post("/socials", authMiddleware, roleMiddleware(["admin", "editor"]), upsertSocialNetworks);

router.post("/contact", createContact);
router.get("/contact", authMiddleware, roleMiddleware(["admin", "editor"]), getContacts);
router.put("/contact/:id/read", authMiddleware, roleMiddleware(["admin", "editor"]), markContactRead);
router.delete("/contact/:id", authMiddleware, roleMiddleware(["admin", "editor"]), deleteContact);

router.post("/comments", createComment);
router.get("/comments", getComments);
router.patch("/comments/:id/approve", authMiddleware, roleMiddleware(["admin", "editor"]), approveComment);
router.patch("/comments/:id/reject", authMiddleware, roleMiddleware(["admin", "editor"]), rejectComment);
router.delete("/comments/:id", authMiddleware, roleMiddleware(["admin", "editor"]), deleteComment);

router.get("/products", async (_req, res) => {
  try {
    const products = await Product.find({ activo: true }).populate("categoria").sort({ createdAt: -1 });
    return sendSuccess(res, "Productos obtenidos.", products);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener los productos.");
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const categories = await Category.find({ activo: true }).sort({ createdAt: -1 });
    return sendSuccess(res, "Categorías obtenidas.", categories);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener las categorías.");
  }
});

router.get("/sliders", async (_req, res) => {
  try {
    const items = await Slider.find({ activo: true }).sort({ orden: 1, createdAt: -1 });
    return sendSuccess(res, "Slider obtenido.", items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo obtener el slider.");
  }
});

router.get("/banners", async (_req, res) => {
  try {
    const items = await Banner.find({ activo: true }).sort({ createdAt: -1 });
    return sendSuccess(res, "Banners obtenidos.", items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener los banners.");
  }
});

router.get("/news", async (_req, res) => {
  try {
    const items = await News.find({ activo: true }).sort({ fecha: -1 });
    return sendSuccess(res, "Noticias obtenidas.", items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener las noticias.");
  }
});

router.get("/faq", async (_req, res) => {
  try {
    const items = await FAQ.find({ activo: true }).sort({ orden: 1, createdAt: -1 });
    return sendSuccess(res, "FAQ obtenida.", items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo obtener la FAQ.");
  }
});

router.get("/social-config", async (_req, res) => {
  try {
    const socials = await SocialNetwork.find({ activo: true }).sort({ createdAt: -1 });
    return sendSuccess(res, "Redes sociales obtenidas.", socials);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener las redes sociales.");
  }
});

router.post("/upload", authMiddleware, roleMiddleware(["admin", "editor"]), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "No se recibió ningún archivo válido.");
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return sendSuccess(res, "Archivo subido correctamente.", { url: fileUrl, filename: req.file.filename });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo subir el archivo.");
  }
});

router.post("/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return sendError(res, 400, "El mensaje es obligatorio.");
  }

  if (message.length > 500) {
    return sendError(res, 400, "El mensaje excede el límite permitido.");
  }

  const configuredPythonServiceUrl = process.env.PYTHON_CHAT_SERVICE_URL?.trim();
  const pythonServiceUrl = configuredPythonServiceUrl ?? (process.env.VERCEL === "1" ? undefined : "http://localhost:8001");

  if (!pythonServiceUrl) {
    return sendSuccess(res, "El servicio de IA no está disponible en este momento.", {
      response:
        "Gracias por tu mensaje. El asistente inteligente está temporalmente no disponible, pero puedes escribirnos por WhatsApp al 618 444 4686.",
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(`${pythonServiceUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Python chat service error:", errorText);
      return sendSuccess(res, "El servicio de IA no está disponible en este momento.", {
        response:
          "Gracias por tu mensaje. El asistente inteligente está temporalmente no disponible, pero puedes escribirnos por WhatsApp al 618 444 4686.",
      });
    }

    const data = await response.json();
    return sendSuccess(res, "Respuesta generada.", {
      response: typeof data?.response === "string" ? data.response : "Gracias por tu mensaje.",
    });
  } catch (error) {
    console.error("Error al consultar el servicio de IA de Python:", error);
    return sendSuccess(res, "El servicio de IA no está disponible en este momento.", {
      response:
        "Gracias por tu mensaje. El asistente inteligente está temporalmente no disponible, pero puedes escribirnos por WhatsApp al 618 444 4686.",
    });
  }
});

router.get("/health", (_req, res) => {
  return sendSuccess(res, "API funcionando.", { ok: true });
});

export default router;
