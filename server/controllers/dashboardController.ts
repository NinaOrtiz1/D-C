import type { Request, Response } from "express";

import { Category, Comment, Contact, LoginHistory, Order, Product, User } from "../models.js";
import { getMercadoLibreStatus } from "../services/mercadoLibreService.js";
import { sendError, sendSuccess } from "../utils/api.js";

export async function getDashboardStats(_req: Request, res: Response) {
  try {
    // Aggregated stats used by the frontend dashboard
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalComments,
      totalContacts,
      pendingOrders,
      preparationOrders,
      sales,
      recentLogins,
      lowStockProducts,
    ] = await Promise.all([
      User.countDocuments({ activo: true }),
      Product.countDocuments({ activo: true }),
      Category.countDocuments({ activo: true }),
      Comment.countDocuments(),
      Contact.countDocuments(),
      Order.countDocuments({ estado: "pendiente" }),
      Order.countDocuments({ estado: { $in: ["en_preparacion", "en_produccion"] } }),
      Order.aggregate([
        { $match: { estado: { $nin: ["cancelado"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      LoginHistory.find({}).sort({ fecha: -1 }).limit(10).select("usuario fecha exitoso").lean(),
      Product.find({
        activo: true,
        $or: [{ stock: { $lte: 5 } }, { $expr: { $lte: ["$stock", "$stockMinimo"] } }],
      })
        .limit(10)
        .select("nombre precio stock stockMinimo imagenes")
        .lean(),
    ]);

    const stats = {
      totalUsers,
      totalProducts,
      totalCategories,
      totalComments,
      totalContacts,
      pendingOrders,
      preparationOrders,
      sales: Number(sales[0]?.total ?? 0),
      mercadoLibre: getMercadoLibreStatus(),
      lowStockProducts,
      recentLogins,
    };

    return sendSuccess(res, "Estadísticas del dashboard obtenidas.", stats);
  } catch (error) {
    console.error("[Dashboard] ERROR:", error);
    return sendError(res, 500, "No se pudieron obtener las estadísticas del dashboard.");
  }
}
