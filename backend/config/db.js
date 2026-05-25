import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    // Add more detailed connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduced from 10000 to prevent Vercel execution timeouts
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined. Please check your .env file or environment variables.');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error details:', error);
    // Throw error instead of process.exit(1) so Express error handler can catch it or Vercel can handle it gracefully
    throw error;
  }
};

export default connectDB;
