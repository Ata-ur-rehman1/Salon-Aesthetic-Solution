import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  fetchSpecialProducts,
  fetchDiscountedProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// ⚠️ Important: Specific routes MUST come before parametric routes (/:id)
// Otherwise /:id will catch /top, /special, etc.

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/special", fetchSpecialProducts);
router.get("/discounted", fetchDiscountedProducts);
router.get("/allProducts", fetchAllProducts);
router.post("/filtered-products", filterProducts);

// General routes
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, upload.none(), addProduct);

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// Parametric routes (must be last)
router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, upload.none(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

export default router;
