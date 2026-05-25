import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    image2: { type: String },
    image3: { type: String },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    isDiscounted: { type: Boolean, default: false }, // New field
    category: { type: ObjectId, ref: "Category", required: true },
    isSpecial: { type: Boolean, default: false }, // Changed from special ObjectId to boolean
    description: { type: String, required: true },
    pdName2: { type: String },
    description2: { type: String, required: true },
    pdName3: { type: String },
    description3: { type: String, required: true },
    pdName4: { type: String },
    description4: { type: String },
    pdName5: { type: String },
    description5: { type: String },
    pdName6: { type: String },
    description6: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
