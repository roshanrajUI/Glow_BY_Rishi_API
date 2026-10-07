export interface AppBindings extends Env {
  RESEND_API_KEY: string;
}

/**
 * Minimal shape compatible with both the Web File API (Workers) and the
 * previous Express.Multer.File usage, so service/repository signatures did
 * not need to change.
 */
export type UploadedImage = File;
