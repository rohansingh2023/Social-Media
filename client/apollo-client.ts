import { ApolloClient, InMemoryCache } from '@apollo/client'

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

const client = new ApolloClient({
  uri: 'http://localhost:4000/api',
  cache: new InMemoryCache(),
})

export default client
