import { getCurrentUserData } from "./get-currentUser-data";
import { is_Authenticated } from "./is-authenicated";
import { verifyToken } from "./verify-token";

export const middleware = {
  Query: {
    hello: verifyToken,
    currentUser: getCurrentUserData,
    onlyUsersExcludingMe: getCurrentUserData,
    usersExcludingMe: getCurrentUserData,
    onlyMyFriendsPost: is_Authenticated,
  },
  Mutation: {
    logout: is_Authenticated,
    updateUser: getCurrentUserData,
    likePost: getCurrentUserData,
    createComment: getCurrentUserData,
    deleteComment: getCurrentUserData,
    friendRequest: getCurrentUserData,
    acceptFriendRequest: getCurrentUserData,
    declineFriendRequest: getCurrentUserData,
    unFriend: getCurrentUserData,
    addPost: getCurrentUserData,
    updatePost: is_Authenticated,
    deletePost: is_Authenticated,
  },
};
