import { Router } from "express";

import { Product } from "../models.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { sendError, sendSuccess } from "../utils/api.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await Product.find({ activo: true }).populate("categoria").sort({ createdAt: -1 });
    return sendSuccess(res, "Productos obtenidos.", products);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudieron obtener los productos.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoria");
    if (!product) return sendError(res, 404, "Producto no encontrado.");
    return sendSuccess(res, "Producto obtenido.", product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo obtener el producto.");
  }
});

router.post("/", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const body = req.body ?? {};
    const product = await Product.create({
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: Number(body.precio ?? 0),
      stock: Number(body.stock ?? 0),
      categoria: body.categoria,
      marca: body.marca || "",
      modelo: body.modelo || "",
      imagenes: Array.isArray(body.imagenes) ? body.imagenes : [],
      activo: body.activo !== false,
    });

    return sendSuccess(res, "Producto creado.", product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo crear el producto.");
  }
});

router.put("/:id", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return sendError(res, 404, "Producto no encontrado.");
    return sendSuccess(res, "Producto actualizado.", product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo actualizar el producto.");
  }
});

router.delete("/:id", authMiddleware, roleMiddleware(["admin", "editor"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendError(res, 404, "Producto no encontrado.");
    return sendSuccess(res, "Producto eliminado.", product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo eliminar el producto.");
  }
});

export default router;
