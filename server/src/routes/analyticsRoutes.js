import express from "express";
import { getStats, getMonthlySales, getRecentOrders, getAdvancedReports } from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// All analytics routes are protected and admin-only
router.get("/stats", protect, adminOnly, getStats);
router.get("/monthly-sales", protect, adminOnly, getMonthlySales);
router.get("/recent-orders", protect, adminOnly, getRecentOrders);
router.get("/advanced-reports", protect, adminOnly, getAdvancedReports);

export default router;
