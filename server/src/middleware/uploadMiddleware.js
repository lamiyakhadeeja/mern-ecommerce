import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name"
) {
  console.warn(
    "[upload] WARNING: Cloudinary credentials are missing or not set in server/.env. Image uploads will fail."
  );
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mern-ecommerce",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const upload = multer({ storage: storage });
