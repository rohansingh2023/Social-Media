import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config;

export const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.DB_URL}`);
    console.log(`Database connected to: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
