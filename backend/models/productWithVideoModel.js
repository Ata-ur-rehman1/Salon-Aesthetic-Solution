import mongoose from 'mongoose';

const product23Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
    pdName2: {
    type: String,
    required: true,
  },
    description2: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String, // Or mongoose.Schema.Types.ObjectId if you have a Category model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
    brand: {
    type: String,
    required: true,
  },
  video: {
    type: String, // Store the path to the video
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const createProductWithVideoModel = mongoose.model('Product', product23Schema);
export default createProductWithVideoModel;