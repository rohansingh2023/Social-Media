import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get("userJwt");
  const subToken = token?.substring(1, token.length - 1);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${subToken}` : "",
    },
  };
});

const client = new ApolloClient({
  // uri: 'https://sm-graphql-api.onrender.com/api',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
  // link: link,
});

export default client;
