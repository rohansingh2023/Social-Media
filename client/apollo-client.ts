import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         users: {
//           merge(existing, incoming) {
//             return incoming
//           },
//         },
//         // projects: {
//         //   merge(existing, incoming) {
//         //     return incoming
//         //   },
//         // },
//       },
//     },
//   },
// })

// const link = createHttpLink({
//   uri: 'http://localhost:8000/graphql',
//   credentials: 'include',
// })

const client = new ApolloClient({
  // uri: 'https://sm-graphql-api.onrender.com/api',
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
  // link: link,
})

export default client
