import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  let token;
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
