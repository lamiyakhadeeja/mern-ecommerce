import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "NOT SET");
console.log("CLOUDINARY_API_KEY   :", process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.slice(0,6) + "..." : "NOT SET");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "***SET***" : "NOT SET");
