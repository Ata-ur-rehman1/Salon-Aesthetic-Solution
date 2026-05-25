import express from "express";
import { handleCJWebhook } from "../controllers/cjController.js";

const router = express.Router();

// Public webhook route (security validation handled in controller via secret validation)
router.post("/order-status", handleCJWebhook);

export default router;
