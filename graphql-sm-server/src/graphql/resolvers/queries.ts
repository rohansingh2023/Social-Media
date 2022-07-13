import { AuthenticationError } from "apollo-server-express";
import { model } from "mongoose";
import models from "../../models";
import User from "../../models/User";

export default {
  hello: () => "Hello world!",

  currentUser: async (parent: any, args: any, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must login to get your user");
    }
    const userData = await models.User.findById(user.id);
    return {
      user: userData,
      posts: await models.Post.find({ user: userData.id }),
    };
  },

  userById: async (parent: any, { id }: any, { models }) => {
    const userData = await models.User.findById(id);
    return {
      user: userData,
      posts: await models.Post.find({ user: userData.id }),
    };
  },

  users: async (parent: any, args: any, { models }) => {
    const users = await models.User.find();
    return users.map(async (user: { id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user.id }),
    }));
  },
  onlyUsersExcludingMe: async (_: any, args: any, { models, user }) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== user.id
    );
    return users;
  },
  usersExcludingMe: async (parent: any, args: any, { models, user }) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== user.id
    );
    return users.map(async (user: { id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user.id }),
    }));
  },

  onlyUsers: async (parent: any, args: any, { models }) => {
    const users = await models.User.find();
    return users;
  },

  posts: async () => {
    try {
      const posts = await models.Post.find().sort({ createdAt: -1 });
      return posts.map(async (post) => {
        return {
          posts: post,
          user: await models.User.findById(post.user),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },

  postById: async (parent: any, args: any, { models }) => {
    try {
      const post = await models.Post.findById(args.id);
      return {
        posts: post,
        user: await models.User.findById(post.user),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error getting post");
    }
  },

  postByUserId: async (parent: any, args: any, { models }) => {
    try {
      const posts = await models.Post.find({ user: args.id }).sort({
        createdAt: -1,
      });
      return posts.map(async (post) => {
        return {
          posts: post,
          user: await models.User.findById(post.user),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },

  searchUsers: async (parent: any, args: any, { models }) => {
    try {
      const regex = new RegExp(args.searchTerm, "i");
      const users = await models.User.find({
        $or: [{ name: regex }, { email: regex }],
      }).sort({ createdAt: -1 });
      return {
        users,
        totalCount: users.length,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  friendRequests: async (_: any, args: any, { models }) => {
    try {
      const userDet = await models.User.findById(args.id);
      // if (userDet.friendRequests.length > 0) {
      return userDet.map((f: any) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        createdAt: f.createdAt,
        profilePic: f.profilePic,
      }));
      // } else {
      //   return "No friend Requests";
      // }
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  friends: async (_: any, args: any, { models }) => {
    try {
      const userDet = await models.User.findById(args.id);
      return userDet.friends.map((f: any) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        createdAt: f.createdAt,
        profilePic: f.profilePic,
      }));
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  onlyMyFriendsPost: async (_: any, args: any, { models, user }) => {
    try {
      if (!user) {
        throw new AuthenticationError(
          "You must login to send a friend request"
        );
      }
      const me = await models.User.findById(user.id);
      const posts2 = await models.Post.find();
      posts2.map(async (p: any) => {
        const user = await models.User.findById(p.user);
        // return me.friends.map((u:any)=>{
        //   posts:
        // })
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },
};
