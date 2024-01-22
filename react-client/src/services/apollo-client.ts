import { ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";

const token = Cookies.get("userJwt");
const subToken = token?.substring(1, token.length - 1);

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: token ? `Bearer ${subToken}` : "",
  },
  credentials: "include",
});

export default client;
