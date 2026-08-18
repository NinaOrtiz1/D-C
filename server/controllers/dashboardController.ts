import type { Request, Response } from "express";

import { ActivityLog, Category, Comment, Contact, LoginHistory, News, Product, User } from "../models.js";
import { sendError, sendSuccess } from "../utils/api.js";

export async function getDashboardStats(_req: Request, res: Response) {
  try {
    // Aggregated stats used by the frontend dashboard
    const [totalUsers, totalProducts, totalCategories, totalComments, totalContacts, recentLogins] = await Promise.all([
      User.countDocuments({ activo: true }),
      Product.countDocuments({ activo: true }),
      Category.countDocuments({ activo: true }),
      Comment.countDocuments(),
      Contact.countDocuments(),
      LoginHistory.find({}).sort({ fecha: -1 }).limit(10).select("usuario fecha exitoso").lean(),
    ]);

    const lowStockProducts = await Product.find({ activo: true, stock: { $lte: 5 } })
      .limit(10)
      .select("nombre price stock imagenes")
      .lean();

    const stats = {
      totalUsers,
      totalProducts,
      totalCategories,
      totalComments,
      totalContacts,
      lowStockProducts,
      recentLogins,
    };

    return sendSuccess(res, "Estadísticas del dashboard obtenidas.", stats);
  } catch (error) {
    console.error("[Dashboard] ERROR:", error);
    return sendError(res, 500, "No se pudieron obtener las estadísticas del dashboard.");
  }
}
