import models from "../../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import User from "../../models/User";

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
      return jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        "secret"
      );
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
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        "secret"
      );

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
      if (post.likes.find((like: any) => like.email === user.email)) {
        // Post already liked, unlike it
        post.likes = post.likes.filter(
          (like: any) => like.email !== user.email
        );
      } else {
        // Post not liked, like it
        post.likes.push({
          name: user.name,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }
      await post.save();
      return post;
    } else {
      throw new Error("Post not found");
    }
  },
  createComment: async (
    _: any,
    { postId, body }: any,
    { models, user }: any
  ) => {
    if (!user) {
      throw new AuthenticationError("You must login to create a comment");
    }
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
        name: user.name,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      return post;
    } else throw new UserInputError("Post not found");
  },

  deleteComment: async (
    _: any,
    { postId, commentId }: any,
    { models, user }: any
  ) => {
    if (!user) {
      throw new AuthenticationError("You must login to delete a comment");
    }
    const post = await models.Post.findById(postId);
    if (post) {
      const commentIndex = post.comments.findIndex(
        (c: { id: any }) => c.id === commentId
      );
      if (post.comments[commentIndex].email === user.email) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        return post;
      } else {
        throw new AuthenticationError("You can only delete your own comments");
      }
    } else {
      throw new UserInputError("Post not found");
    }
  },

  friendRequest: async (_: any, { id }: any, { models, user }: any) => {
    try {
      if (!user) {
        throw new AuthenticationError(
          "You must login to send a friend request"
        );
      }
      const userTo = await models.User.findById(id);
      const userFrom = await models.User.findById(user.id);
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
        return userTo;
      }
    } catch (error) {
      throw new Error("Error sending friend request");
    }
  },

  acceptFriendRequest: async (
    _: any,
    { email }: any,
    { models, user }: any
  ) => {
    try {
      if (!user) {
        throw new AuthenticationError(
          "You must login to accept a friend request"
        );
      }
      const requestSender = await models.User.findOne({ email });
      const requestReceiver = await models.User.findById(user.id);
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
        // requestReceiver.friendRequests.filter((f: any) => f.email === email);
        // requestReceiver.friendRequests.remove({ email: email });
        await models.User.updateOne(
          { _id: requestReceiver.id },
          { $pull: { friendRequests: { email: email } } }
        );
        // requestReceiver.friendRequests.pull({ email: email });
        await requestReceiver.save();
        await requestSender.save();
        return requestReceiver;
      } else {
        throw new UserInputError("Already Friends");
      }
    } catch (error) {
      throw new Error("Error accepting friend request");
    }
  },
  unFriend: async (_: any, { email }: any, { models, user }: any) => {
    try {
      if (!user) {
        throw new AuthenticationError(
          "You must login to accept a friend request"
        );
      }
      const friend = await models.User.findOne({ email });
      const currentUser = await models.User.findById(user.id);
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
        return friend;
      } else {
        throw new UserInputError("Not in my friends List");
      }
    } catch (error) {
      throw new Error("Error in unfriending");
    }
  },
};
