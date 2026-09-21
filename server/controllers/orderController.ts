import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { InventoryMovement, Order, Product } from "../models.js";
import {
  escapeHtml,
  getAdminNotificationEmail,
  sendEmail,
} from "../services/emailService.js";
import { sendError, sendSuccess } from "../utils/api.js";

type AuthenticatedRequest = Request & { user?: { id: string; role?: string } };

function getUserId(req: Request) {
  return (req as AuthenticatedRequest).user?.id;
}

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const shipping = req.body?.datosEntrega ?? req.body?.shippingAddress ?? {};

    if (!userId || items.length === 0) return sendError(res, 400, "El pedido debe incluir productos.");
    if (!shipping.nombre || !shipping.direccion) {
      return sendError(res, 400, "El nombre y la dirección de entrega son obligatorios.");
    }

    const productIds = items.map((item: { producto?: string }) => item.producto);
    if (productIds.some((id: string) => !isValidObjectId(id))) {
      return sendError(res, 400, "Uno de los productos no es válido.");
    }

    const products = await Product.find({ _id: { $in: productIds }, activo: true }).lean();
    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const orderItems: Array<{
      producto: typeof products[number]["_id"];
      nombre: string;
      cantidad: number;
      precioUnitario: number;
      total: number;
    } | null> = items.map((item: { producto: string; cantidad?: number }) => {
      const product = productMap.get(item.producto);
      const cantidad = Number(item.cantidad);
      if (!product || !Number.isInteger(cantidad) || cantidad < 1) return null;
      const precioUnitario = Number(product.precio ?? product.price ?? 0);
      return {
        producto: product._id,
        nombre: product.nombre,
        cantidad,
        precioUnitario,
        total: precioUnitario * cantidad,
      };
    });

    if (orderItems.some((item) => !item)) return sendError(res, 400, "Los productos o cantidades no son válidos.");
    const safeItems = orderItems.filter(Boolean) as NonNullable<(typeof orderItems)[number]>[];
    const subtotal = safeItems.reduce((sum, item) => sum + item.total, 0);
    const units = safeItems.reduce((sum, item) => sum + item.cantidad, 0);
    const esPedidoGrande = units >= 50 || subtotal >= 10000;

    const orderOrigin = ["WEB", "MERCADO_LIBRE", "MANUAL"].includes(String(req.body?.origen))
      ? String(req.body.origen)
      : "WEB";
    const reservedItems: typeof safeItems = [];
    const movementIds: string[] = [];
    for (const item of safeItems) {
      const reserved = await Product.findOneAndUpdate(
        { _id: item.producto, activo: true, stock: { $gte: item.cantidad } },
        { $inc: { stock: -item.cantidad } },
        { new: true },
      );
      if (!reserved) {
        await Promise.all(
          reservedItems.map((reservedItem) =>
            Product.updateOne({ _id: reservedItem.producto }, { $inc: { stock: reservedItem.cantidad } }),
          ),
        );
        return sendError(res, 409, `No hay stock suficiente para ${item.nombre}.`);
      }
      reservedItems.push(item);
      try {
        const movement = await InventoryMovement.create({
          producto: item.producto,
          cantidad: item.cantidad,
          tipo: "salida",
          motivo: `Pedido ${orderOrigin}`,
          usuario: userId,
          stockAnterior: reserved.stock + item.cantidad,
          stockPosterior: reserved.stock,
        });
        movementIds.push(String(movement._id));
      } catch (error) {
        await Promise.all(
          reservedItems.map((reservedItem) =>
            Product.updateOne({ _id: reservedItem.producto }, { $inc: { stock: reservedItem.cantidad } }),
          ),
        );
        await InventoryMovement.deleteMany({ _id: { $in: movementIds } });
        throw error;
      }
    }

    let order;
    try {
      order = await Order.create({
        usuario: userId,
        items: safeItems,
        subtotal,
        total: subtotal,
        datosEntrega: {
          nombre: String(shipping.nombre).trim(),
          telefono: String(shipping.telefono ?? shipping.phone ?? "").trim(),
          direccion: String(shipping.direccion).trim(),
          ciudad: String(shipping.ciudad ?? "").trim(),
          estado: String(shipping.estado ?? "").trim(),
          codigoPostal: String(shipping.codigoPostal ?? "").trim(),
        },
        notas: String(req.body?.notas ?? "").trim(),
        origen: orderOrigin,
        esPedidoGrande,
        requiereCotizacion: esPedidoGrande,
      });
      await InventoryMovement.updateMany(
        { _id: { $in: movementIds } },
        { $set: { pedido: order._id } },
      );
    } catch (error) {
      await Promise.all(
        reservedItems.map((reservedItem) =>
          Product.updateOne({ _id: reservedItem.producto }, { $inc: { stock: reservedItem.cantidad } }),
        ),
      );
      await InventoryMovement.deleteMany({ _id: { $in: movementIds } });
      throw error;
    }

    const notificationEmail = getAdminNotificationEmail();
    if (notificationEmail) {
      void sendEmail({
        to: notificationEmail,
        subject: `${esPedidoGrande ? "Pedido grande" : "Nuevo pedido"} por $${subtotal.toLocaleString("es-MX")}`,
        html: `<h2>${esPedidoGrande ? "Pedido grande" : "Nuevo pedido"}</h2><p><strong>Unidades:</strong> ${units}</p><p><strong>Total:</strong> $${subtotal.toLocaleString("es-MX")} MXN</p><p><strong>Entrega:</strong> ${escapeHtml(String(shipping.nombre))}, ${escapeHtml(String(shipping.direccion))}</p>`,
      }).catch((error) => console.error("No se pudo enviar la notificación del pedido", error));
    }

    return sendSuccess(res, "Pedido creado correctamente.", order);
  } catch (error) {
    console.error("createOrder", error);
    return sendError(res, 500, "No se pudo crear el pedido.");
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const currentUser = (req as AuthenticatedRequest).user;
    const filter = currentUser?.role === "admin" || currentUser?.role === "editor"
      ? {}
      : { usuario: currentUser?.id };
    const orders = await Order.find(filter).populate("usuario", "nombre correo rol telefono").sort({ createdAt: -1 });
    return sendSuccess(res, "Pedidos obtenidos.", orders);
  } catch (error) {
    console.error("getOrders", error);
    return sendError(res, 500, "No se pudieron obtener los pedidos.");
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const allowed = [
      "pendiente",
      "confirmado",
      "en_preparacion",
      "en_produccion",
      "listo",
      "enviado",
      "entregado",
      "cancelado",
    ];
    if (!allowed.includes(String(req.body?.estado))) return sendError(res, 400, "El estado del pedido no es válido.");
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { estado: String(req.body.estado) },
      { new: true, runValidators: true },
    );
    if (!order) return sendError(res, 404, "Pedido no encontrado.");
    return sendSuccess(res, "Estado del pedido actualizado.", order);
  } catch (error) {
    console.error("updateOrderStatus", error);
    return sendError(res, 500, "No se pudo actualizar el pedido.");
  }
}