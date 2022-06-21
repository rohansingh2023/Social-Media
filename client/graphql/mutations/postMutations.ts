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

const LIKE_POST = gql`
  mutation likePost($id: ID!) {
    likePost(id: $id) {
      id
      content
      image
      createdAt
      likes {
        id
        createdAt
      }
    }
  }
`

const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      content
      likes {
        id
        createdAt
      }
      comments {
        id
        name
        body
        createdAt
      }
    }
  }
`

const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $content: String, $image: String) {
    updatePost(id: $id, content: $content, image: $image) {
      id
      content
      image
      createdAt
    }
  }
`

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export { ADD_POST, LIKE_POST, ADD_COMMENT, UPDATE_POST, DELETE_POST }
