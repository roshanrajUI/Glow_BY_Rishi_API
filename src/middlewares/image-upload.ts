import multer from "multer";
import path from "path";

const createStorage = (folder: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}`);
    },

    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);

      const fileName = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extension}`;

      cb(null, fileName);
    },
  });

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG and WebP images are allowed"));
  }
};

export const imageUpload = (folder: string) =>
  multer({
    storage: createStorage(folder),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
