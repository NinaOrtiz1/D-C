import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error("[API_ERROR]", {
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    success: false,
    message: "Ha ocurrido un error en el servidor.",
  });
}
