import { ApiError } from "../models/api.error";
import { newId } from "./db";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function inferExtension(file: File): string {
  if (file.type && extensionByType[file.type]) {
    return extensionByType[file.type];
  }
  const match = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  return match ? match[1].toLowerCase() : "bin";
}

/**
 * Stores an uploaded image in R2 (replaces multer's disk storage) and
 * returns the same `/uploads/<folder>/<filename>` relative URL shape the
 * previous Express app produced, so stored `image_url` values keep working.
 */
export async function saveImageToR2(
  bucket: R2Bucket,
  folder: string,
  file: File,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ApiError(400, "Only JPEG, PNG and WebP images are allowed");
  }

  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_FILE_SIZE) {
    throw new ApiError(400, "Image must be smaller than 5MB");
  }

  const fileName = `${Date.now()}-${newId()}.${inferExtension(file)}`;
  const key = `${folder}/${fileName}`;

  await bucket.put(key, bytes, {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  return `/uploads/${key}`;
}

export function extractFile(
  form: FormData,
  field: string,
  required: boolean,
): File | undefined {
  const entry = form.get(field);
  if (entry instanceof File && entry.size > 0) {
    return entry;
  }
  if (required) {
    throw new ApiError(400, "Service image is required");
  }
  return undefined;
}
