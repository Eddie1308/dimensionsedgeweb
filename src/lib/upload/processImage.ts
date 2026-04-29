// Sharp pipeline for admin uploads:
// - Strips EXIF (privacy + size)
// - Caps dimensions to 2400×2400 (covers 2x retina up to 1200px display)
// - Re-encodes to WebP at quality 82 — WebP is universally supported in 2026
//   and roughly 30% smaller than JPEG at equivalent visual quality.
//
// Saves under /public/uploads/<yyyy>/<mm>/<random>.webp so paths are
// roughly chronological and survive directory listings sanely.

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const UPLOAD_BASE_DIR = "public/uploads";
export const UPLOAD_PUBLIC_PREFIX = "/uploads";
export const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
]);

export type ProcessedImage = {
  url: string;
  bytes: number;
  width: number;
  height: number;
};

export async function processAndStoreImage(
  buffer: Buffer,
  mime: string,
): Promise<ProcessedImage> {
  if (!ALLOWED_MIME.has(mime.toLowerCase())) {
    throw new Error(`Unsupported image type: ${mime}`);
  }
  if (buffer.byteLength > MAX_INPUT_BYTES) {
    throw new Error(
      `Image exceeds ${MAX_INPUT_BYTES / 1024 / 1024} MB limit`,
    );
  }

  const pipeline = sharp(buffer, { failOn: "error" })
    .rotate() // honor EXIF orientation, then strip
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const filename = `${crypto.randomBytes(8).toString("hex")}.webp`;
  const relDir = path.join(yyyy, mm);
  const absDir = path.join(process.cwd(), UPLOAD_BASE_DIR, relDir);
  await fs.mkdir(absDir, { recursive: true });
  await fs.writeFile(path.join(absDir, filename), data);

  return {
    url: `${UPLOAD_PUBLIC_PREFIX}/${yyyy}/${mm}/${filename}`,
    bytes: data.byteLength,
    width: info.width,
    height: info.height,
  };
}
