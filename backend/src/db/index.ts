import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URL}`, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
