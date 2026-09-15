import { Router } from "express";

import { getDashboardStats } from "../controllers/dashboardController.js";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import {
  createManagedUser,
  deleteManagedUser,
  getUsers,
  updateManagedUser,
} from "../controllers/authController.js";
import {
  createComment,
  approveComment,
  deleteComment,
  getComments,
  rejectComment,
} from "../controllers/commentController.js";
import {
  createContact,
  deleteContact,
  getContacts,
  markContactRead,
} from "../controllers/contactController.js";
import {
  getSiteConfig,
  getSocialNetworks,
  updateSiteConfig,
  upsertSocialNetworks,
} from "../controllers/siteController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { getMercadoLibreStatus } from "../services/mercadoLibreService.js";
import { Banner, Category, FAQ, News, Slider, SocialNetwork } from "../models.js";
import productsRouter from "./products.js";
import { sendError, sendSuccess } from "../utils/api.js";

const router = Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["admin", "editor"]), getDashboardStats);
router.get(
  "/mercadolibre/status",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  (_req, res) => sendSuccess(res, "Estado de Mercado Libre obtenido.", getMercadoLibreStatus()),
);

router.get("/users", authMiddleware, roleMiddleware(["admin"]), getUsers);
router.post("/users", authMiddleware, roleMiddleware(["admin"]), createManagedUser);
router.put("/users/:id", authMiddleware, roleMiddleware(["admin"]), updateManagedUser);
router.delete("/users/:id", authMiddleware, roleMiddleware(["admin"]), deleteManagedUser);

router.use("/products", productsRouter);

router.post("/orders", authMiddleware, createOrder);
router.get("/orders", authMiddleware, getOrders);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  updateOrderStatus,
);

router.get("/site-config", getSiteConfig);
router.put("/site-config", authMiddleware, roleMiddleware(["admin", "editor"]), updateSiteConfig);

router.get("/socials", getSocialNetworks);
router.post("/socials", authMiddleware, roleMiddleware(["admin", "editor"]), upsertSocialNetworks);

router.post("/contact", createContact);
router.get("/contact", authMiddleware, roleMiddleware(["admin", "editor"]), getContacts);
router.put(
  "/contact/:id/read",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  markContactRead,
);
router.delete("/contact/:id", authMiddleware, roleMiddleware(["admin", "editor"]), deleteContact);

router.post("/comments", createComment);
router.get("/comments", getComments);
router.patch(
  "/comments/:id/approve",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  approveComment,
);
router.patch(
  "/comments/:id/reject",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  rejectComment,
);
router.delete("/comments/:id", authMiddleware, roleMiddleware(["admin", "editor"]), deleteComment);

router.get("/categories", async (_req, res) => {
  try {
    const categories = await Category.find({ activo: true }).sort({ createdAt: -1 });
    return sendSuccess(res, "Categorías obtenidas.", categories);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener las categorías.");
  }
});

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    try {
      const nombre = String(req.body?.nombre ?? req.body?.name ?? "").trim();
      if (!nombre) return sendError(res, 400, "El nombre de la categoría es obligatorio.");
      const category = await Category.create({
        nombre,
        name: req.body?.name || nombre,
        descripcion: String(req.body?.descripcion ?? req.body?.description ?? "").trim(),
        imagen: String(req.body?.imagen ?? req.body?.image ?? "").trim(),
        activo: req.body?.activo !== false,
        active: req.body?.active !== false,
      });
      return sendSuccess(res, "Categoría creada.", category);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, "No se pudo crear la categoría.");
    }
  },
);

router.put(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!category) return sendError(res, 404, "Categoría no encontrada.");
      return sendSuccess(res, "Categoría actualizada.", category);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, "No se pudo actualizar la categoría.");
    }
  },
);

router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) return sendError(res, 404, "Categoría no encontrada.");
      return sendSuccess(res, "Categoría eliminada.", category);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, "No se pudo eliminar la categoría.");
    }
  },
);

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

router.post("/news", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const titulo = String(req.body?.titulo ?? req.body?.title ?? "").trim();
    const contenido = String(req.body?.contenido ?? req.body?.content ?? "").trim();
    if (!titulo || !contenido) return sendError(res, 400, "Título y contenido son obligatorios.");
    const news = await News.create({
      titulo,
      title: req.body?.title || titulo,
      contenido,
      content: req.body?.content || contenido,
      imagen: String(req.body?.imagen ?? req.body?.image ?? "").trim(),
      autor: String(req.body?.autor ?? req.body?.author ?? "").trim(),
      activo: req.body?.activo !== false,
      active: req.body?.active !== false,
    });
    return sendSuccess(res, "Noticia creada.", news);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo crear la noticia.");
  }
});

router.put("/news/:id", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!news) return sendError(res, 404, "Noticia no encontrada.");
    return sendSuccess(res, "Noticia actualizada.", news);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo actualizar la noticia.");
  }
});

router.delete(
  "/news/:id",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    try {
      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) return sendError(res, 404, "Noticia no encontrada.");
      return sendSuccess(res, "Noticia eliminada.", news);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, "No se pudo eliminar la noticia.");
    }
  },
);

router.get("/faq", async (_req, res) => {
  try {
    const items = await FAQ.find({ activo: true }).sort({ orden: 1, createdAt: -1 });
    return sendSuccess(res, "FAQ obtenida.", items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo obtener la FAQ.");
  }
});

router.post("/faq", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const pregunta = String(req.body?.pregunta ?? req.body?.question ?? "").trim();
    const respuesta = String(req.body?.respuesta ?? req.body?.answer ?? "").trim();
    if (!pregunta || !respuesta)
      return sendError(res, 400, "Pregunta y respuesta son obligatorias.");
    const faq = await FAQ.create({
      pregunta,
      question: req.body?.question || pregunta,
      respuesta,
      answer: req.body?.answer || respuesta,
      orden: Number(req.body?.orden ?? req.body?.order ?? 0),
      activo: req.body?.activo !== false,
      active: req.body?.active !== false,
    });
    return sendSuccess(res, "Pregunta frecuente creada.", faq);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo crear la pregunta frecuente.");
  }
});

router.put("/faq/:id", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return sendError(res, 404, "Pregunta frecuente no encontrada.");
    return sendSuccess(res, "Pregunta frecuente actualizada.", faq);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo actualizar la pregunta frecuente.");
  }
});

router.delete("/faq/:id", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return sendError(res, 404, "Pregunta frecuente no encontrada.");
    return sendSuccess(res, "Pregunta frecuente eliminada.", faq);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo eliminar la pregunta frecuente.");
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

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return sendError(res, 400, "No se recibió ningún archivo válido.");
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return sendSuccess(res, "Archivo subido correctamente.", {
        url: fileUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      console.error(error);
      return sendError(res, 500, "No se pudo subir el archivo.");
    }
  },
);

router.post("/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return sendError(res, 400, "El mensaje es obligatorio.");
  }

  if (message.length > 500) {
    return sendError(res, 400, "El mensaje excede el límite permitido.");
  }

  const configuredPythonServiceUrl = process.env.PYTHON_CHAT_SERVICE_URL?.trim();
  const pythonServiceUrl =
    configuredPythonServiceUrl ??
    (process.env.VERCEL === "1" ? undefined : "http://localhost:8001");

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
