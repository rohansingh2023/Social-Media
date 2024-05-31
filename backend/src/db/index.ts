import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../logging";

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URL}`, {});
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.info(error);
  }
};

export default dbConnect;
