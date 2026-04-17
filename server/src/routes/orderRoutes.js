import { Router } from "express";
import {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, listMyOrders);
router.get("/admin/all", protect, adminOnly, listAllOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
