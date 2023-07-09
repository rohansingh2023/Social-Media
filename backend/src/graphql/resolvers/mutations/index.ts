import { PostMutation } from "./post";
import { UserMutation } from "./user";

export const Mutation = {
  ...UserMutation,
  ...PostMutation,
};
