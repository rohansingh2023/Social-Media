import { redisClient } from "../../../app";

export const PostQuery = {
  posts: async (parent: any, args: any, { models }: any) => {
    try {
      const postsCacheKey = "smPosts";
      const postsCacheData = await redisClient.get(postsCacheKey);
      if (postsCacheData) {
        console.log(`Cache Hit at key: ${postsCacheKey}`);
        return JSON.parse(postsCacheData).map(async (post: any) => {
          return {
            posts: post,
            user: await models.User.findById(post.user),
          };
        });
      }
      const posts = await models.Post.find().sort({ createdAt: -1 });
      await redisClient.set(postsCacheKey, JSON.stringify(posts));
      console.log(`Cache Miss at key: ${postsCacheKey}`);
      return posts.map(async (post: any) => {
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

  postById: async (parent: any, args: any, { models }: any) => {
    try {
      const postsCacheKey = `smPost:${args.id}`;
      const postsCacheData = await redisClient.get(postsCacheKey);
      if (postsCacheData) {
        console.log(`Cache Hit at key: ${postsCacheKey}`);
        return {
          posts: JSON.parse(postsCacheData),
          user: await models.User.findById(JSON.parse(postsCacheData).user),
        };
      }
      const post = await models.Post.findById(args.id);
      await redisClient.set(postsCacheKey, JSON.stringify(post));
      console.log(`Cache Miss at key: ${postsCacheKey}`);

      return {
        posts: post,
        user: await models.User.findById(post.user),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error getting post");
    }
  },

  postByUserId: async (parent: any, args: any, { models }: any) => {
    try {
      const posts = await models.Post.find({ user: args.id }).sort({
        createdAt: -1,
      });
      return posts.map(async (post: any) => {
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
