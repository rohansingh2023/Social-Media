import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/smChatDb?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
    );
    console.log(`Database connected to: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
