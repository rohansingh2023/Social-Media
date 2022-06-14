import { gql } from '@apollo/client'

const ADD_POST = gql`
  mutation addPost(
    $title: String!
    $content: String!
    $image: String!
    $likes: [String]
    $comments: [String]
    $userId: String!
  ) {
    addPost(
      title: $title
      content: $content
      image: $image
      likes: $likes
      comments: $comments
      userId: $userId
    ) {
      id
      title
      content
      image
      likes
      comments
      user {
        id
        name
        email
        profilePic
        bio
        dob
      }
    }
  }
`

export { ADD_POST }
