import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { redisClient } from "../../../app";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const PostMutation = {
  addPost: async (parent: any, args: any, { models, payload }: any) => {
    await redisClient.flushall();
    const photoUrl = await cloudinary.uploader.upload(args.image);
    return models.Post.create({
      content: args.content,
      image: photoUrl.url,
      user: new mongoose.Types.ObjectId(payload.id),
    });
  },

  updatePost: async (
    parent: any,
    { id, content, image }: any,
    { models }: any
  ) => {
    await redisClient.flushall();
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
  },
  deletePost: async (parent: any, { id }: any, { models }: any) => {
    try {
      await models.Post.findOneAndRemove({ _id: id });
      await redisClient.flushall();
      return true;
    } catch (err) {
      return false;
    }
  },
};
