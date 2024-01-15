import { create } from "zustand";
import client from "../services/apollo-client";
import { CURRENT_USER } from "../graphql/queries/userQueries";

interface CurrentUserState {
  currentUser: CurrentUser;
  addCurrentUser: () => void;
}

export const useCurrentState = create<CurrentUserState>()((set) => ({
  currentUser: {
    user: {
      _id: "",
      email: "",
      bio: "",
      dob: "",
      name: "",
      profilePic: "",
      friendRequests: [],
      friends: [],
    },
  },
  addCurrentUser: async () => {
    try {
      const { data } = await client.query({
        query: CURRENT_USER,
      });
      set({ currentUser: data?.currentUser });
    } catch (error) {
      console.log(error);
    }
  },
}));
