import { redisClient } from "../../../app";
import { ContextPayloads } from "src/types";

export const PostQuery = {
  posts: async (parent: any, args: any,{ models, log4u }: ContextPayloads) => {
    log4u.log({message: "Request for posts query"})
    try {
      const postsCacheKey = "smPosts";
      const postsCacheData = await redisClient.get(postsCacheKey);
      if (postsCacheData) {
        log4u.log({
          type: "INFO",
          message: `Cache Hit: Successfully retrieved posts from cache using key: ${postsCacheKey}`,
        });
        return JSON.parse(postsCacheData).map(async (post: any) => ({
          posts: post,
          user: await models.User.findById(post.user),
        }));
      }
      log4u.log({
        type: "INFO",
        message: `Cache Miss: Fetching posts from the database as cache key '${postsCacheKey}' was not found.`,
      });
      const posts = await models.Post.find().sort({ createdAt: -1 });
      await redisClient.set(postsCacheKey, JSON.stringify(posts));

      log4u.log({
        type: "INFO",
        message: `Database Query: Retrieved for query posts. Cache updated with key: ${postsCacheKey}.`,
      });
      return posts.map(async (post: any) => ({
        posts: post,
        user: await models.User.findById(post.user),
      }));
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error("Error getting posts");
    }
  },

  postById: async (parent: any, args: any, { models, log4u }: ContextPayloads) => {
    try {
      const postsCacheKey = `smPost:${args.id}`;
      const postsCacheData = await redisClient.get(postsCacheKey);
      if (postsCacheData) {
        log4u.log({
          type: "INFO",
          message: `Cache Hit: Successfully retrieved post by ID from cache using key: ${postsCacheKey}`,
        });
        const cachedPost = JSON.parse(postsCacheData);
        return {
          posts: cachedPost,
          user: await models.User.findById(cachedPost.user),
        };
      }
      log4u.log({
        type: "INFO",
        message: `Cache Miss: Fetching post by ID '${args.id}' from the database as cache key '${postsCacheKey}' was not found.`,
      });
      const post = await models.Post.findById(args.id);
      await redisClient.set(postsCacheKey, JSON.stringify(post));
      log4u.log({
        type: "INFO",
        message: `Database Query: Retrieved for query postById '${args.id}'. Cache updated with key: ${postsCacheKey}.`,
      });
      return {
        posts: post,
        user: await models.User.findById(post.user),
      };
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error("Error getting post");
    }
  },

  postByUserId: async (parent: any, args: any, { models, log4u }: ContextPayloads) => {
    try {
      log4u.log({
        type: "INFO",
        message: `Fetching posts for user ID '${args.id}' from the database.`,
      });
      const posts = await models.Post.find({ user: args.id }).sort({
        createdAt: -1,
      });
      log4u.log({
        type: "INFO",
        message: `Database Query: Retrieved for query postByUserId '${args.id}'.`,
      });
      return posts.map(async (post: any) => ({
        posts: post,
        user: await models.User.findById(post.user),
      }));
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error("Error getting posts");
    }
  },
};
