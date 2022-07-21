import { gql } from '@apollo/client'

const GET_CONVERSATIONS_OF_A_USER = gql`
  query getConversations($id: ID!) {
    getConversations(id: $id) {
      id
      members {
        sender
        receiver
      }
      createdAt
    }
  }
`
export { GET_CONVERSATIONS_OF_A_USER }
