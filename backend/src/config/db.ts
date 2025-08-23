import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI);
    
    await mongoose.connect(
        process.env.MONGODB_URI as string
    );
    console.log("✅ MongoDB connected");    
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
