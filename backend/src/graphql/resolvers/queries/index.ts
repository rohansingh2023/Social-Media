import { PostQuery } from "./post";
import { UserQuery } from "./user";

export const Query = {
  ...UserQuery,
  ...PostQuery,
};
