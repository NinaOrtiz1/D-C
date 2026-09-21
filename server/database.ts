import fs from "node:fs";
import path from "node:path";

import mongoose from "mongoose";

function readMongoUriFromDotEnv() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;

    const contents = fs.readFileSync(filePath, "utf8");
    const match = contents.match(/^\s*MONGODB_URI\s*=\s*(?:['"])?([^\r\n'"\s]+)(?:['"])?/m);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

function getMongoUri() {
  const uriFromEnv = process.env.MONGODB_URI?.trim();
  if (uriFromEnv) {
    return uriFromEnv;
  }

  return readMongoUriFromDotEnv();
}

function sanitizeMongoUri(uri: string) {
  return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:@/]+):([^@/]+)@/i, "$1***:***@");
}

export function getMongoDbUriForLogs() {
  const uri = getMongoUri();
  if (!uri) {
    return "MONGODB_URI no configurada";
  }

  return sanitizeMongoUri(uri);
}

type MemoryServer = {
  getUri(): string;
  stop(): Promise<void>;
};

let memoryServer: MemoryServer | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      const mongoUri = getMongoUri();

      if (!mongoUri) {
        throw new Error(
          "MONGODB_URI no está configurada. Añade una URI válida de MongoDB Atlas en el archivo .env antes de iniciar el backend.",
        );
      }

      if (!/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
        throw new Error(
          "MONGODB_URI inválida. Debe comenzar con mongodb:// o mongodb+srv:// y apuntar a MongoDB Atlas.",
        );
      }

      try {
        await mongoose.connect(mongoUri, {
          dbName: "aether",
          serverSelectionTimeoutMS: 15000,
        });

        console.log("MongoDB Atlas conectado correctamente en la base de datos 'aether'.");
        return mongoose;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        const safeMessage = sanitizeMongoUri(message);

        console.error(
          "No se pudo conectar a MongoDB Atlas. Revisa MONGODB_URI y las credenciales.",
        );
        console.error(`Detalle: ${safeMessage}`);
        throw error;
      }
    })();
  }

  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
      console.log("Instancia de MongoDB en memoria detenida.");
    }
    connectionPromise = null;
    console.log("Conexión de MongoDB cerrada correctamente.");
  } catch (error) {
    console.error("Error al desconectar la base de datos:", error);
  }
}
