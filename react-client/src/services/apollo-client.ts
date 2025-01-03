import { ApolloClient, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";

const token = Cookies.get("userJwt");
const subToken = token?.substring(1, token.length - 1);
const acesss_token = localStorage.getItem("userToken")
const matches = acesss_token?.match(/"(.*?)"/)

const client = new ApolloClient({
  uri: "http://localhost:9001/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: matches ? `${matches[1]}` : "",
  },
  credentials: "include",
});

export default client;
