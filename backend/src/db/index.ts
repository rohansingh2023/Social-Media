import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../logging";
import { Logger } from "log4u";

dotenv.config();

const dbConnect = async (log4u:Logger) => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URL}`, {});
    log4u.log({message:"Connected to MongoDB"})
    logger.info("Connected to MongoDB");
  } catch (error) {
    log4u.log({type:"ERROR", message: error})
    logger.info(error);
  }
};

export default dbConnect;
