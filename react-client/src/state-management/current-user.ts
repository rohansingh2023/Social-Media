import { create } from "zustand";
import client from "../services/apollo-client";
import { CURRENT_USER } from "../graphql/queries/userQueries";

interface CurrentUserState {
  currentUser: CurrentUser;
  loading: boolean;
  error: string | null;
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
  loading: false,
  error: null,
  addCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.query({
        query: CURRENT_USER,
      });

      set({ currentUser: data?.currentUser, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
}));
