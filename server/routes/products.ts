import { Router } from "express";
import { isValidObjectId } from "mongoose";

import { InventoryMovement, Product } from "../models.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { sendError, sendSuccess } from "../utils/api.js";

const router = Router();

function getAuthenticatedUserId(req: Parameters<typeof authMiddleware>[0]) {
  return String((req as typeof req & { user?: { id?: string } }).user?.id ?? "");
}

function parseNonNegativeNumber(value: unknown, integer = false) {
  const parsed = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) return null;
  return parsed;
}

function normalizeSku(value: unknown) {
  const sku = String(value ?? "").trim().toUpperCase();
  return sku && /^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(sku) ? sku : "";
}

router.get("/", async (_req, res) => {
  try {
    const products = await Product.find({ activo: true })
      .populate("categoria")
      .sort({ createdAt: -1 });
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
    const nombre = String(body.nombre ?? body.name ?? "").trim();
    const descripcion = String(body.descripcion ?? body.description ?? "").trim();
    const precio = parseNonNegativeNumber(body.precio ?? body.price);
    const stock = parseNonNegativeNumber(body.stock, true);
    const stockMinimo = parseNonNegativeNumber(body.stockMinimo ?? body.minimumStock, true);
    const sku = normalizeSku(body.sku);

    if (!nombre || !descripcion) return sendError(res, 400, "Nombre y descripción son obligatorios.");
    if (precio === null || stock === null || (body.stockMinimo !== undefined && stockMinimo === null)) {
      return sendError(res, 400, "Precio, stock y stock mínimo deben ser números válidos.");
    }
    if (body.sku && !sku) return sendError(res, 400, "El SKU no tiene un formato válido.");
    if (sku && (await Product.exists({ sku }))) return sendError(res, 409, "El SKU ya está registrado.");

    const product = await Product.create({
      nombre,
      descripcion,
      precio,
      stock,
      stockMinimo: stockMinimo ?? 0,
      sku,
      disponible: body.disponible !== false,
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
    const body = req.body ?? {};
    const updates: Record<string, unknown> = {};
    const allowedFields = [
      "nombre",
      "descripcion",
      "precio",
      "stock",
      "stockMinimo",
      "sku",
      "disponible",
      "activo",
      "categoria",
      "marca",
      "modelo",
      "imagenes",
    ];
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) updates[field] = body[field];
    }
    if (updates.nombre !== undefined) updates.nombre = String(updates.nombre).trim();
    if (updates.descripcion !== undefined) updates.descripcion = String(updates.descripcion).trim();
    if (updates.sku !== undefined) {
      const sku = normalizeSku(updates.sku);
      if (updates.sku && !sku) return sendError(res, 400, "El SKU no tiene un formato válido.");
      if (sku && (await Product.exists({ sku, _id: { $ne: req.params.id } }))) {
        return sendError(res, 409, "El SKU ya está registrado.");
      }
      updates.sku = sku;
    }
    for (const field of ["precio", "stock", "stockMinimo"]) {
      if (updates[field] !== undefined) {
        const parsed = parseNonNegativeNumber(updates[field], field !== "precio");
        if (parsed === null) return sendError(res, 400, `${field} debe ser un número válido.`);
        updates[field] = parsed;
      }
    }
    if (!Object.keys(updates).length) return sendError(res, 400, "No hay cambios válidos.");

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) return sendError(res, 404, "Producto no encontrado.");
    return sendSuccess(res, "Producto actualizado.", product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "No se pudo actualizar el producto.");
  }
});

router.get(
  "/:id/inventory",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) return sendError(res, 400, "Producto no válido.");
    const movements = await InventoryMovement.find({ producto: req.params.id })
      .populate("usuario", "nombre correo")
      .sort({ fecha: -1 })
      .limit(100)
      .lean();
    return sendSuccess(res, "Movimientos de inventario obtenidos.", movements);
  },
);

router.post(
  "/:id/inventory",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    const quantity = parseNonNegativeNumber(req.body?.cantidad, true);
    const type = String(req.body?.tipo ?? "");
    const reason = String(req.body?.motivo ?? "").trim();
    if (!isValidObjectId(req.params.id) || !userId) return sendError(res, 400, "Producto o usuario no válido.");
    if (!quantity || !["entrada", "salida", "ajuste"].includes(type) || !reason) {
      return sendError(res, 400, "Cantidad, tipo y motivo son obligatorios.");
    }

    const product = await Product.findById(req.params.id).select("stock activo");
    if (!product || !product.activo) return sendError(res, 404, "Producto no encontrado.");
    const nextStock = type === "entrada" ? product.stock + quantity : type === "salida" ? product.stock - quantity : quantity;
    if (nextStock < 0) return sendError(res, 409, "El stock no puede quedar negativo.");

    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, stock: product.stock },
      { $set: { stock: nextStock } },
      { new: true },
    );
    if (!updated) return sendError(res, 409, "El stock cambió. Revisa e intenta nuevamente.");

    try {
      const movement = await InventoryMovement.create({
        producto: updated._id,
        cantidad: quantity,
        tipo: type,
        motivo: reason,
        usuario: userId,
        stockAnterior: product.stock,
        stockPosterior: nextStock,
      });
      return sendSuccess(res, "Movimiento de inventario registrado.", { product: updated, movement });
    } catch (error) {
      await Product.updateOne({ _id: updated._id, stock: nextStock }, { $set: { stock: product.stock } });
      throw error;
    }
  },
);

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
