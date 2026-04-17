import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/single", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  res.json({ url: req.file.path });
});

router.post("/multiple", protect, upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }
  const urls = req.files.map((file) => file.path);
  res.json({ urls });
});

export default router;
