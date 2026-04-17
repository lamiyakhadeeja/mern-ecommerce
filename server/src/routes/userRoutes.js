import { Router } from "express";
import { listUsers, getUserById, updateProfile } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.put("/profile", protect, updateProfile);
router.get("/", protect, adminOnly, listUsers);
router.get("/:id", protect, adminOnly, getUserById);

export default router;
