import path from "node:path";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDatabase, disconnectDatabase, getMongoDbUriForLogs } from "./database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js";

dotenv.config();
dotenv.config({ path: ".env.local", override: false });

export const app = express();
const port = Number(process.env.PORT ?? 4000);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.APP_URL,
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.VERCEL !== "1") {
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export async function startLocalServer() {
  try {
    await connectDatabase();
    console.log(`MongoDB URI configurada: ${getMongoDbUriForLogs()}`);

    const server = app.listen(port, () => {
      console.log(`Backend escuchando en http://localhost:${port}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("El backend no pudo arrancar porque la conexión a MongoDB Atlas falló.");
    console.error(error instanceof Error ? error.message : "Error desconocido al iniciar el backend.");
    process.exit(1);
  }
}
