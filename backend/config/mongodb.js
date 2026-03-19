import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/furnova`);

    console.log("MongoDB Connected");

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB error:", err);
    });
  } catch (error) {
    console.log("Connection failed:", error);
  }
};

export default connectDB;
