import { redisClient } from "../../../index";

export const UserQuery = {
  hello: () => {
    return "Hello World";
  },
  currentUser: async (parent: any, args: any, { models, payload }: any) => {
    try {
      const cachekey = "smCurrentUser";
      const cacheData = await redisClient.get(cachekey);
      // Check if cache data exists
      if (cacheData) {
        console.log(`Cache Hit at key: ${cachekey}`);
        const data = JSON.parse(cacheData);
        return {
          user: data,
          posts: await models.Post.find({ user: data._id }),
        };
      }
      const userData = await models.User.findById(payload.id);
      // Store fetched data from db to redis cache
      await redisClient.set(cachekey, JSON.stringify(userData));
      console.log(`Cache Miss at key: ${cachekey}`);
      return {
        user: userData,
        posts: await models.Post.find({ user: userData.id }),
      };
      // }
    } catch (error) {
      console.log(error);
    }
  },

  userById: async (parent: any, { id }: any, { models }: any) => {
    const userByIdCacheKey = `smUser:${id}`;
    const userByIdCachedata = await redisClient.get(userByIdCacheKey);
    if (userByIdCachedata) {
      console.log(`Cache Hit at key: ${userByIdCacheKey}`);
      return {
        user: JSON.parse(userByIdCachedata),
        posts: await models.Post.find({
          user: JSON.parse(userByIdCachedata)._id,
        }),
      };
    }
    const userData = await models.User.findById(id);
    await redisClient.set(userByIdCacheKey, JSON.stringify(userData));
    console.log(`Cache Miss at key: ${userByIdCacheKey}`);

    return {
      user: userData,
      posts: await models.Post.find({ user: userData._id }),
    };
  },

  users: async (parent: any, args: any, { models }: any) => {
    const usersCachekey = "smUsers";
    const usersCacheData = await redisClient.get(usersCachekey);
    // Check if cache data exists
    if (usersCacheData) {
      console.log(`Cache Hit at key: ${usersCachekey}`);
      return JSON.parse(usersCacheData).map(async (user: any) => {
        return {
          user: user,
          posts: await models.Post.find({ user: user._id }),
        };
      });
    }
    const users = await models.User.find();
    await redisClient.set(usersCachekey, JSON.stringify(users));
    console.log(`Cache Miss at key: ${usersCachekey}`);
    return users.map(async (user: { _id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user._id }),
    }));
  },
  onlyUsersExcludingMe: async (_: any, args: any, { models, payload }: any) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== payload.id
    );
    return users;
  },
  usersExcludingMe: async (
    parent: any,
    args: any,
    { models, payload }: any
  ) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== payload.id
    );
    return users.map(async (user: { id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user.id }),
    }));
  },

  onlyUsers: async (parent: any, args: any, { models }: any) => {
    const users = await models.User.find();
    return users;
  },
  searchUsers: async (parent: any, args: any, { models }: any) => {
    try {
      const usersCachekey = "smSearchUsers";
      const usersCacheData = await redisClient.get(usersCachekey);
      if (usersCacheData) {
        console.log(`Cache Hit at key: ${usersCachekey}`);

        return {
          users: JSON.parse(usersCacheData),
          totalCount: JSON.parse(usersCacheData).length,
        };
      }
      const regex = new RegExp(args.searchTerm, "i");
      const users = await models.User.find({
        $or: [{ name: regex }, { email: regex }],
      }).sort({ createdAt: -1 });
      await redisClient.set(usersCachekey, JSON.stringify(users));
      console.log(`Cache Miss at key: ${usersCachekey}`);
      return {
        users,
        totalCount: users.length,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  friendRequests: async (_: any, args: any, { models }: any) => {
    try {
      const userDet = await models.User.findById(args.id);
      return userDet?.map((f: any) => ({
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
  friends: async (_: any, args: any, { models }: any) => {
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
  onlyMyFriendsPost: async (_: any, { id }: any, { models }: any) => {
    try {
      const me = await models.User.findById(id);
      const posts2 = await models.Post.find();
      me?.friends?.map(async (f: any) => {
        return {
          posts: posts2.filter((p: any) => p.user === f.userId),
          user: await models.User.findById(f.userId),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },
};
