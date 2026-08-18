import fs from "node:fs";
import path from "node:path";

import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const allowedExtensions = /\.(jpg|jpeg|png|webp|gif|svg)$/i;

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".png";
    const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`;
    callback(null, safeName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const hasAllowedExtension = allowedExtensions.test(file.originalname);
    const isAllowedMime = allowedMimeTypes.includes(file.mimetype);

    if (!hasAllowedExtension || !isAllowedMime) {
      return callback(new Error("Tipo de archivo no permitido. Solo imágenes JPG, PNG, WEBP, GIF o SVG."));
    }

    return callback(null, true);
  },
});

export function buildUploadUrl(filename: string) {
  const appUrl = process.env.APP_URL?.trim();
  const baseUrl = appUrl || (process.env.VERCEL === "1" ? "" : "http://localhost:4000");

  return `${baseUrl}/uploads/${filename}`;
}
