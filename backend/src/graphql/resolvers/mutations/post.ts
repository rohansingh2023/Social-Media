import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { redisClient } from "../../../app";
import dotenv from "dotenv";
import { ContextPayloads } from "src/types";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const PostMutation = {
  addPost: async (parent: any, args: any, { models, log4u }: ContextPayloads) => {
    log4u.log({message: "Request arrived for addPost mutation"})
    try {
      await redisClient.flushall();
      const photoUrl = await cloudinary.uploader.upload(args.image);
      log4u.log({type: "DEBUG", message:"addPost mutation processed successfully"})
      return models.Post.create({
        content: args.content,
        image: photoUrl.url,
        user: new mongoose.Types.ObjectId(args.id),
      });
    } catch (error) {
      log4u.log({type: "ERROR", message: error}) 
    }
  },

  updatePost: async (
    parent: any,
    { id, content, image }: any,
    { models, log4u }: ContextPayloads
  ) => {
    log4u.log({message: "Request arrived for updatePost mutation"})
    try {
      await redisClient.flushall();
      log4u.log({type: "DEBUG", message:"updatePost mutation processed successfully"})
      return await models.Post.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            content,
            image,
          },
        },
        {
          new: true,
        }
      );
      
    } catch (error) {
      log4u.log({type: "ERROR", message: error})
    }
  },
  deletePost: async (parent: any, { id }: any, { models, log4u }: ContextPayloads) => {
    log4u.log({message: "Request arrived for deletePost mutation"})
    try {
      await models.Post.findOneAndRemove({ _id: id });
      await redisClient.flushall();
      log4u.log({type: "DEBUG", message:"deletePost mutation processed successfully"})
      return true;
    } catch (err) {
      log4u.log({type: "ERROR", message: err})
      return false;
    }
  },
};
