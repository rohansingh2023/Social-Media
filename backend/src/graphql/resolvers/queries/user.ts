import { ContextPayloads } from "src/types";
import { redisClient } from "../../../app";

export const UserQuery = {
  hello: () => {
    return "Hello World";
  },
  currentUser: async (parent: any, args: any, { models, payload, log4u }: ContextPayloads) => {
    try {
      const cachekey = "smCurrentUser";
      const cacheData = await redisClient.get(cachekey);
      
      if (cacheData) {
        log4u.log({ type: "INFO", message: `Cache Hit at key: ${cachekey}` });
        const data = JSON.parse(cacheData);
        log4u.log({ type: "DEBUG", message: "Returning data from cache"});
        return {
          user: data,
          posts: await models.Post.find({ user: data._id }),
        };
      }
      
      log4u.log({ type: "INFO", message: "Cache Miss. Fetching data from database." });
      const userData = await models.User.findById(payload.id);
      await redisClient.set(cachekey, JSON.stringify(userData));
      log4u.log({ type: "DEBUG", message: "User data fetched and cached" });
      log4u.log({type:"DEBUG", message: "currentUser query processed successfully"});
      return {
        user: userData,
        posts: await models.Post.find({ user: userData.id }),
      };
    } catch (error) {
      log4u.log({ type: "ERROR", message: error });
      throw new Error("Error fetching current user");
    }
  },

  userById: async (parent: any, { id }: any, { models, log4u }: ContextPayloads) => {
    try {
      const userByIdCacheKey = `smUser:${id}`;
      const userByIdCacheData = await redisClient.get(userByIdCacheKey);
      
      if (userByIdCacheData) {
        log4u.log({ type: "INFO", message: `Cache Hit at key: ${userByIdCacheKey}` });
        const cachedData = JSON.parse(userByIdCacheData);
        log4u.log({ type: "DEBUG", message: "Returning user data from cache"});

        return {
          user: cachedData,
          posts: await models.Post.find({ user: cachedData._id }),
        };
      }
      
      log4u.log({ type: "INFO", message: `Cache Miss at key: ${userByIdCacheKey}` });
      const userData = await models.User.findById(id);
      await redisClient.set(userByIdCacheKey, JSON.stringify(userData));
      log4u.log({ type: "DEBUG", message: "User data fetched and cached" });
      log4u.log({type:"DEBUG", message: "userById query processed successfully"});
      return {
        user: userData,
        posts: await models.Post.find({ user: userData._id }),
      };
    } catch (error) {
      log4u.log({ type: "ERROR", message: error });
      throw new Error("Error fetching user by ID");
    }
  },

  users: async (parent: any, args: any, { models, log4u }: ContextPayloads) => {
    try {
      const usersCacheKey = "smUsers";
      const usersCacheData = await redisClient.get(usersCacheKey);

      if (usersCacheData) {
        log4u.log({ type: "INFO", message: `Cache Hit at key: ${usersCacheKey}` });
        const users = JSON.parse(usersCacheData);
        log4u.log({ type: "DEBUG", message: "Returning users data from cache" });

        return users.map(async (user: any) => ({
          user,
          posts: await models.Post.find({ user: user._id }),
        }));
      }

      log4u.log({ type: "INFO", message: `Cache Miss at key: ${usersCacheKey}` });
      const users = await models.User.find();
      await redisClient.set(usersCacheKey, JSON.stringify(users));
      log4u.log({ type: "DEBUG", message: "Fetched and cached users data" });
      log4u.log({type:"DEBUG", message: "users query processed successfully"});
      return users.map(async (user: { _id: any; posts: any }) => ({
        user,
        posts: await models.Post.find({ user: user._id }),
      }));
    } catch (error) {
      log4u.log({ type: "ERROR", message: error });
      throw new Error("Error fetching users");
    }
  },

  onlyUsersExcludingMe: async (_: any, args: any, { models, payload, log4u }: ContextPayloads) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== payload.id
    );
    log4u.log({type:"DEBUG", message: "onlyUsersExcludingMe query processed successfully"});
    return users;
  },
  usersExcludingMe: async (
    parent: any,
    args: any,
    { models, payload, log4u }: ContextPayloads
  ) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== payload.id
    );
    log4u.log({type:"DEBUG", message: "usersExcludingMe query processed successfully"});
    return users.map(async (user: { id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user.id }),
    }));
  },

  onlyUsers: async (parent: any, args: any, { models, log4u }: ContextPayloads) => {
    const users = await models.User.find();
    log4u.log({type:"DEBUG", message: "onlyUsers query processed successfully"});
    return users;
  },
  searchUsers: async (parent: any, args: any, { models, log4u }: ContextPayloads) => {
    try {
      const usersCacheKey = "smSearchUsers";
      const usersCacheData = await redisClient.get(usersCacheKey);

      if (usersCacheData) {
        log4u.log({ type: "INFO", message: `Cache Hit at key: ${usersCacheKey}` });
        const users = JSON.parse(usersCacheData);
        log4u.log({ type: "DEBUG", message: "Returning cached search users"});

        return {
          users,
          totalCount: users.length,
        };
      }

      log4u.log({ type: "INFO", message: "Cache Miss. Searching users in database." });
      const regex = new RegExp(args.searchTerm, "i");
      const users = await models.User.find({
        $or: [{ name: regex }, { email: regex }],
      }).sort({ createdAt: -1 });
      
      await redisClient.set(usersCacheKey, JSON.stringify(users));
      log4u.log({ type: "DEBUG", message: "Searched and cached users data"});
      log4u.log({type:"DEBUG", message: "searchUsers query processed successfully"});
      return {
        users,
        totalCount: users.length,
      };
    } catch (error) {
      log4u.log({ type: "ERROR", message: error });
      throw new Error("Error searching users");
    }
  },
  friendRequests: async (_: any, args: any, { models, log4u }: ContextPayloads) => {
    try {
      const userDet = await models.User.findById(args.id);
      log4u.log({type:"DEBUG", message: "friendRequests query processed successfully"});
      return userDet?.map((f: any) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        createdAt: f.createdAt,
        profilePic: f.profilePic,
      }));
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error("Error getting users");
    }
  },
  friends: async (_: any, args: any, { models, log4u }: ContextPayloads) => {
    try {
      const userDet = await models.User.findById(args.id);
      log4u.log({type:"DEBUG", message: "friends query processed successfully"});
      return userDet.friends.map((f: any) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        createdAt: f.createdAt,
        profilePic: f.profilePic,
      }));
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error("Error getting users");
    }
  },
  onlyMyFriendsPost: async (_: any, { id }: any, { models, log4u }: ContextPayloads) => {
    try {
      const me = await models.User.findById(id);
      const posts2 = await models.Post.find();
      log4u.log({type:"DEBUG", message: "onlyMyFriendsPost query processed successfully"});
      me?.friends?.map(async (f: any) => {
        return {
          posts: posts2.filter((p: any) => p.user === f.userId),
          user: await models.User.findById(f.userId),
        };
      });
    } catch (error) {
      log4u.log({type:"ERROR", message: error})
      throw new Error("Error getting posts");
    }
  },
};
