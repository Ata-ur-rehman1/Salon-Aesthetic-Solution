import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndRemove(req.params.categoryId);
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const selectProductByCategory = asyncHandler(async (req, res) => {
  try {
    const categoryId = await Category.findOne({ _id: req.params.id }); // Ensure valid ObjectID
    if (!categoryId) {
      return res.status(404).json({ error: "Category not found" });
    }
    const products = await Product.find({ category: categoryId._id })
      .populate("category") // Include category data in the response
      .limit(12) // Limit results to 12 (customize as needed)
      .sort({ createdAt: -1 }); // Sort by creation date (descending)
    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this category" });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" }); // Generic error for unexpected issues
  }
});

export {
  selectProductByCategory,
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
