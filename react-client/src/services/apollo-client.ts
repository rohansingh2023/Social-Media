import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Operation,
} from "@apollo/client";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { onError } from "@apollo/client/link/error";

// const token = Cookies.get("userJwt");
// const subToken = token?.substring(1, token.length - 1);
// const acesss_token = localStorage.getItem("userToken");
// const matches = acesss_token?.match(/"(.*?)"/);

// Create an HTTP Link to connect to your GraphQL server
const httpLink = new HttpLink({
  uri: "http://localhost:9001/graphql", // Replace with your GraphQL endpoint
});

// Create an Apollo Link to attach the Authorization header to each request
const authLink = new ApolloLink((operation: Operation, forward) => {
  const accessToken = localStorage.getItem("userToken"); // Get access token from localStorage (or memory)
  const matches = accessToken?.match(/"(.*?)"/);
  if (accessToken) {
    operation.setContext({
      headers: {
        Authorization: `${matches}`,
      },
    });
  }

  return forward(operation); // Proceed with the request
});

// Create an Apollo Link to handle errors (e.g., token expiration)
// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(async ({ message, locations, path }) => {
//       if (message === 'Unauthorized') { // Check for a 401 Unauthorized error from GraphQL
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (refreshToken) {
//           try {
//             // Send a request to your Auth service to refresh the token
//             const response = await axios.post('https://your-auth-service-url.com/refresh-token', {
//               refresh_token: refreshToken,
//             });

//             const { access_token } = response.data;
//             localStorage.setItem('access_token', access_token); // Save new access token

//             // Retry the original request with the new token
//             operation.setContext({
//               headers: {
//                 Authorization: `Bearer ${access_token}`,
//               },
//             });

//             return forward(operation); // Retry the operation
//           } catch (error) {
//             console.error('Failed to refresh token:', error);
//             // Optionally, you can redirect to login or handle the failure
//             window.location.href = '/login';
//           }
//         }
//       }
//     });
//   }

//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//   }
// });

const link = ApolloLink.from([authLink, httpLink]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  credentials: "include",
});

export default client;
