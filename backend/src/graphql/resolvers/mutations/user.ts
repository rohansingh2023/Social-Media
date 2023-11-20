import { AuthenticationError, UserInputError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { redisClient } from "../../../app";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const UserMutation = {
  register: async (
    parent: any,
    { name, email, password, profilePic, dob, bio }: any,
    { models, req }: any
  ) => {
    // normalize email address
    const user = await models.User.findOne({
      email,
    });
    // if there is no user, throw an authentication error
    if (user) {
      throw new AuthenticationError(
        "User already exists. Try with a different emailId"
      );
    }
    // hash the password
    const hashed = await bcrypt.hash(password, 10);
    const photoUrl = await cloudinary.uploader.upload(profilePic);
    // create the gravatar url
    try {
      const user = await models.User.create({
        name,
        email,
        password: hashed,
        profilePic: photoUrl.url,
        bio,
        dob,
      });
      await redisClient.flushall();
      // create and return the json web token
      const jwtUser: String = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        `${process.env.JWT_SECRET_KEY}`
      );
      req.session = {
        jwt: jwtUser,
      };
      return {
        token: req.session.jwt,
        message: "Registered User Successfully",
      };
    } catch (err) {
      console.log(err);
      throw new Error("Error creating account");
    }
  },
  login: async (
    parent: any,
    { email, password }: any,
    { models, req }: any
  ) => {
    try {
      email = email.trim().toLowerCase();

      const user = await models.User.findOne({
        email,
      });
      // if there is no user, throw an authentication error
      if (!user) {
        throw new AuthenticationError("User doesn't exists");
      }
      // if the passwords don't match, throw an authentication error
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new AuthenticationError("Passwords do not match");
      }
      // create and return the json web token
      const jwtUser: String = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        `${process.env.JWT_SECRET_KEY}`
      );

      req.session = {
        jwt: jwtUser,
      };
      return {
        token: jwtUser,
        message: "Logged In User Successfully",
      };
    } catch (error) {
      throw new Error(`${error}`);
      // }
    }
  },
  logout: async (_: any, args: any, { req, client }: any) => {
    req.session = null;
    await client.flushall();
    return "Logged Out Successfully";
  },
  updateUser: async (
    _: any,
    { name, email, profilePic, dob, bio }: any,
    { models, payload }: any
  ) => {
    await redisClient.flushall();
    return await models.User.findOneAndUpdate(
      {
        _id: payload.id,
      },
      {
        $set: {
          name,
          email,
          profilePic,
          dob,
          bio,
        },
      },
      {
        new: true,
      }
    );
  },
  likePost: async (_: any, { id }: any, { models, payload }: any) => {
    const post = await models.Post.findById(id);
    if (post) {
      if (post.likes.find((like: any) => like.email === payload.email)) {
        // Post already liked, unlike it
        post.likes = post.likes.filter(
          (like: any) => like.email !== payload.email
        );
      } else {
        // Post not liked, like it
        post.likes.push({
          name: payload.name,
          email: payload.email,
          createdAt: new Date().toISOString(),
        });
      }
      await post.save();
      await redisClient.flushall();
      return post;
    } else {
      throw new Error("Post not found");
    }
  },
  createComment: async (
    _: any,
    { postId, body }: any,
    { models, payload }: any
  ) => {
    if (body.trim() === "") {
      throw new UserInputError("Comment body must not be empty", {
        errors: {
          body: "Comment body must not be empty",
        },
      });
    }
    const post = await models.Post.findById(postId);
    if (post) {
      post.comments.unshift({
        body,
        name: payload.name,
        email: payload.email,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      await redisClient.flushall();
      return post;
    } else throw new UserInputError("Post not found");
  },

  deleteComment: async (
    _: any,
    { postId, commentId }: any,
    { models, payload }: any
  ) => {
    const post = await models.Post.findById(postId);
    if (post) {
      const commentIndex = post.comments.findIndex(
        (c: { id: any }) => c.id === commentId
      );
      if (post.comments[commentIndex].email === payload.email) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        await redisClient.flushall();
        return post;
      } else {
        throw new AuthenticationError("You can only delete your own comments");
      }
    } else {
      throw new UserInputError("Post not found");
    }
  },

  friendRequest: async (_: any, { id }: any, { models, payload }: any) => {
    try {
      const userTo = await models.User.findById(id);
      const userFrom = await models.User.findById(payload.id);
      if (userTo.friendRequests.find((f: any) => f.id === userFrom.id)) {
        userTo.friendRequests = userTo.friendRequests.filter(
          (f: any) => f.id !== userFrom.id
        );
      } else {
        userTo.friendRequests.push({
          userId: userFrom.id,
          email: userFrom.email,
          name: userFrom.name,
          profilePic: userFrom.profilePic,
          createdAt: new Date().toISOString(),
        });
        await userTo.save();
        await redisClient.flushall();
        return userTo;
      }
    } catch (error) {
      throw new Error("Error sending friend request");
    }
  },

  acceptFriendRequest: async (
    _: any,
    { email }: any,
    { models, payload }: any
  ) => {
    try {
      const requestSender = await models.User.findOne({ email });
      const requestReceiver = await models.User.findById(payload.id);
      if (
        !requestReceiver.friends.find((f: any) => f.email === email) &&
        !requestSender.friends.find(
          (f: any) => f.email === requestReceiver.email
        )
      ) {
        requestReceiver.friends.push({
          userId: requestSender.id,
          name: requestSender.name,
          email: requestSender.email,
          profilePic: requestSender.profilePic,
          createdAt: new Date().toISOString(),
        });
        requestSender.friends.push({
          userId: requestReceiver.id,
          name: requestReceiver.name,
          email: requestReceiver.email,
          profilePic: requestReceiver.profilePic,
          createdAt: new Date().toISOString(),
        });
        await models.User.updateOne(
          { _id: requestReceiver.id },
          { $pull: { friendRequests: { email: email } } }
        );
        await requestReceiver.save();
        await requestSender.save();
        await redisClient.flushall();
        return requestReceiver;
      } else {
        throw new UserInputError("Already Friends");
      }
    } catch (error) {
      throw new Error("Error accepting friend request");
    }
  },
  declineFriendRequest: async (
    _: any,
    { email }: any,
    { models, payload }: any
  ) => {
    try {
      const me = await models.User.findById(payload.id);
      await models.User.updateOne(
        { _id: me.id },
        { $pull: { friendRequests: { email: email } } }
      );
      await me.save();
      await redisClient.flushall();
    } catch (err) {
      throw new Error("Error declining friend request");
    }
  },
  unFriend: async (_: any, { email }: any, { models, payload }: any) => {
    try {
      const friend = await models.User.findOne({ email });
      const currentUser = await models.User.findById(payload.id);
      if (currentUser.friends.find((f: any) => f.email === friend.email)) {
        await models.User.updateOne(
          { _id: currentUser.id },
          { $pull: { friends: { email: friend.email } } }
        );
        await models.User.updateOne(
          { _id: friend.id },
          { $pull: { friends: { email: currentUser.email } } }
        );
        await friend.save();
        await currentUser.save();
        await redisClient.flushall();
        return friend;
      } else {
        throw new UserInputError("Not in my friends List");
      }
    } catch (error) {
      throw new Error("Error in unfriending");
    }
  },
};
