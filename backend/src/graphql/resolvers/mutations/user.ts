import { AuthenticationError, UserInputError } from "apollo-server-express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { redisClient } from "../../../app";
import dotenv from "dotenv";
import Producer from "../../../utils/rabbitmq/producer";
import { ContextPayloads } from "src/types";

const producer = new Producer();

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
        {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.profilePic,
        },
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
        {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.profilePic,
        },
        `${process.env.JWT_SECRET_KEY}`
      );

      req.session = {
        jwt: jwtUser,
      };
      return {
        token: jwtUser,
        message: "Logged In User Successfully",
        // details: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.profilePic,
        // },
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
    { id, name, email, profilePic, dob, bio }: any,
    { models, log4u }: ContextPayloads
  ) => {
    log4u.log({message:"Request arrived for updateUser mutation"})
    try {
      await redisClient.flushall();
      log4u.log({type:"DEBUG", message:"updateUser mutation processed successfully"})
      return await models.User.findOneAndUpdate(
        {
          _id: id,
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
      
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error(`${error}`)
    }
  },
  likePost: async (_: any, { id, name, email, profilePic }: any, { models, log4u }: ContextPayloads) => {
    log4u.log({message:"Request arrived for likePost mutation"})
    try {
      const post = await models.Post.findById(id);
      if (post) {
        if (post.likes.find((like: any) => like.email === email)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter(
            (like: any) => like.email !== email
          );
        } else {
          // Post not liked, like it
          post.likes.push({
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        await redisClient.flushall();
        log4u.log({type:"DEBUG", message:"Redis Cache cleared"})
        await producer.publishMsg("Like", {
          id: post.user,
          profilePic: profilePic,
          messageInfo: `${name} liked your post`,
        });
        log4u.log({type:"DEBUG", message:"User Info published to `Like` queue"})
        log4u.log({type:"DEBUG", message:"likePost mutation processed successfully"})
        return post;
      } else {
        log4u.log({type:"ERROR", message: "Post not found"})
        throw new Error("Post not found");
      }
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error(`${error}`)
    }
  },
  createComment: async (
    _: any,
    { postId, body, name, email, profilePic }: any,
    { models, log4u }: ContextPayloads
  ) => {
    log4u.log({message:"Request arrived for createComment mutation"})
    try {
      if (body.trim() === "") {
        log4u.log({type:"ERROR", message: "Comment body must not be empty"})
        throw new UserInputError("UserInputError --> Comment body must not be empty", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }
      const post = await models.Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        await redisClient.flushall();
        log4u.log({type:"DEBUG", message:"Redis Cache cleared"})
        await producer.publishMsg("Comment", {
          id: post.user,
          profilePic: profilePic,
          messageInfo: `${name} commented on your post`,
        });
        log4u.log({type:"DEBUG", message:"Comment Info published to `Comment` queue"})
        log4u.log({type:"DEBUG", message:"createComment mutation processed successfully"})
        return post;
      } else {
        log4u.log({type:"ERROR", message: "UserInputError --> Post not found"})
        throw new UserInputError("Post not found");
      }
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error(`${error}`)
    }
  },

  deleteComment: async (
    _: any,
    { postId, commentId, email }: any,
    { models, log4u }: ContextPayloads
  ) => {
  log4u.log({message:"Request arrived for deleteComment mutation"})
   try {
    const post = await models.Post.findById(postId);
    if (post) {
      const commentIndex = post.comments.findIndex(
        (c: { id: any }) => c.id === commentId
      );
      if (post.comments[commentIndex].email === email) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        await redisClient.flushall();
        log4u.log({type:"DEBUG", message:"Redis Cache cleared"})
        log4u.log({type:"DEBUG", message:"deleteComment mutation processed successfully"})
        return post;
      } else {
        log4u.log({type:"ERROR", message:"AuthenticationError --> You can only delete your own comments"})
        throw new AuthenticationError("You can only delete your own comments");
      }
    } else {
      log4u.log({type:"ERROR", message: "UserInputError --> Post not found"})
      throw new UserInputError("Post not found");
    }
   } catch (error) {
    log4u.log({type:"ERROR", message: error})
    throw new Error(`${error}`)
   }
  },

  friendRequest: async (_: any, { id }: any, { models, payload }: ContextPayloads) => {
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
        await producer.publishMsg("Friend", {
          id: userTo.id,
          profilePic: userFrom.profilePic,
          messageInfo: `${userFrom.name} sent you a friend request`,
        });
        return userTo;
      }
    } catch (error) {
      throw new Error("Error sending friend request");
    }
  },

  acceptFriendRequest: async (
    _: any,
    { email }: any,
    { models, payload }: ContextPayloads
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
        await producer.publishMsg("Friend", {
          id: requestSender.id,
          profilePic: requestReceiver.profilePic,
          messageInfo: `${requestReceiver.name} accepted your friend request`,
        });
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
    { models, payload }: ContextPayloads
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
  unFriend: async (_: any, { email }: any, { models, payload }: ContextPayloads) => {
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
        await producer.publishMsg("Friend", {
          id: friend.id,
          profilePic: currentUser.profilePic,
          messageInfo: `${currentUser.name} unfriended you`,
        });
        return friend;
      } else {
        throw new UserInputError("Not in my friends List");
      }
    } catch (error) {
      throw new Error("Error in unfriending");
    }
  },
};
