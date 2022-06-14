import { AuthenticationError } from "apollo-server-express";
import models from "../../models";

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
};
