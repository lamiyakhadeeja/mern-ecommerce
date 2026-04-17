import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim() || process.env.MONGO_URI?.trim();
  if (!uri) {
    console.warn("MONGODB_URI is not set. Add it to server/.env (or project root .env).");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
