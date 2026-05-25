import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      pdName2,
      description2,
      pdName3,
      description3,
      pdName4,
      description4,
      pdName5,
      description5,
      pdName6,
      description6,
      price,
      isDiscount,
      isSpecial,
      category,
      quantity,
      brand,
    } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !pdName2:
        return res.json({ error: "Input name is required" });
      case !description2:
        return res.json({ error: "Description is required" });
      case !pdName3:
        return res.json({ error: "Input name is required" });
      case !description3:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }
    const product = new Product({ ...req.body });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      pdName2,
      description2,
      pdName3,
      description3,
      pdName4,
      description4,
      pdName5,
      description5,
      pdName6,
      description6,
      price,
      category,
      isSpecial,
      isDiscounted,
      quantity,
      brand,
    } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !pdName2:
        return res.status(400).json({ error: "Input name 2 is required" });
      case !description2:
        return res.status(400).json({ error: "Description 2 is required" });
      case !pdName3:
        return res.status(400).json({ error: "Input name 3 is required" });
      case !description3:
        return res.status(400).json({ error: "Description 3 is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
    }

    // Check if product exists
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 12;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .sort({ pageSize: -1 })
      .limit(pageSize);
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "profileImage");
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      // .limit(12)
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(14);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchSpecialProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ isSpecial: true });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchDiscountedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ isDiscounted: true });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
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
};
