import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { selectProductByCategory } from "../controllers/categoryController.js";
router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id/products").get(selectProductByCategory);
router.route("/:ids").get(readCategory);

export default router;
