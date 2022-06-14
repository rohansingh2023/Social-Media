import { gql } from '@apollo/client'

const ADD_POST = gql`
  mutation addPost($content: String!, $image: String!) {
    addPost(content: $content, image: $image) {
      id
      content
      image
    }
  }
`

export { ADD_POST }
