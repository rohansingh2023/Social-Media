import { GraphQLClient } from "graphql-request";
import { GET_POSTS } from "../graphql/queries/postQueries";
import Cookies from "js-cookie";

const token = Cookies.get("userJwt");
const subToken = token?.substring(1, token.length - 1);
const GRAPHQL_ENDPOINT = "http://localhost:8081/graphql";
const authClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${subToken}`,
  },
});

export const getPosts = async () => {
  const results = await authClient.request(GET_POSTS);
  return results;
};
