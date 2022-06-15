import models from "../../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";
import mongoose from "mongoose";

export default {
  addPost: (parent: any, args: any, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must login to create a new book");
    }
    return models.Post.create({
      content: args.content,
      image: args.image,
      user: new mongoose.Types.ObjectId(user.id),
    });
  },

  updatePost: async (parent: any, { id, content, image }: any, { models }) => {
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
  deletePost: async (parent: any, { id }: any, { models }) => {
    try {
      await models.Post.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  register: async (
    parent: any,
    { name, email, password, profilePic, dob, bio }: any,
    { models }
  ) => {
    // normalize email address
    email = email.trim().toLowerCase();
    // hash the password
    const hashed = await bcrypt.hash(password, 10);
    // create the gravatar url
    try {
      const user = await models.User.create({
        name,
        email,
        password: hashed,
        profilePic,
        bio,
        dob,
      });
      // create and return the json web token
      return jwt.sign({ id: user._id, name: user.name }, "secret");
    } catch (err) {
      console.log(err);
      throw new Error("Error creating account");
    }
  },
  login: async (parent: any, { email, password }: any, { models }) => {
    try {
      if (email) {
        email = email.trim().toLowerCase();
      }
      const user = await models.User.findOne({
        email,
      });
      // if there is no user, throw an authentication error
      if (!user) {
        throw new AuthenticationError("Error signing in");
      }
      // if the passwords don't match, throw an authentication error
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new AuthenticationError("Error signing in");
      }
      // create and return the json web token
      const token = jwt.sign({ id: user._id, name: user.name }, "secret");

      return {
        token,
        user,
        message: "Successfully signed in",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error logging in");
    }
  },
  likePost: async (_: any, { id }: any, { models, user }: any) => {
    if (!user) {
      throw new AuthenticationError("You must login to like a post");
    }
    const post = await models.Post.findById(id);
    if (post) {
      if (
        post.likes.find((like: any) => like.id.toString() === String(user.id))
      ) {
        // Post already liked, unlike it
        post.likes = post.likes.filter(
          (like: any) => like.id.toString() !== String(user.id)
        );
      } else {
        // Post not liked, like it
        post.likes.push({
          name: user.name,
          createdAt: new Date().toISOString(),
        });
      }
      await post.save();
      return post;
    } else {
      throw new Error("Post not found");
    }
  },
};
