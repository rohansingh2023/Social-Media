import { create } from "zustand";
import client from "../services/apollo-client";
import { CURRENT_USER, GET_USER_BY_ID } from "../graphql/queries/userQueries";

interface CurrentUserState {
  currentUser: CurrentUser;
  loading: boolean;
  error: string | null;
  addCurrentUser: (id: any) => void;
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
  addCurrentUser: async (id: any) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.query({
        query: GET_USER_BY_ID,
        variables:{
          id
        }
      });
      set({ currentUser: data?.userById, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
}));
