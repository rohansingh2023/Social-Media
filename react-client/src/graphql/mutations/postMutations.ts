import { gql } from "@apollo/client";

const ADD_POST = gql`
  mutation addPost($id: ID!, $content: String!, $image: String!) {
    addPost(id: $id, content: $content, image: $image) {
      _id
      content
      image
      comments {
        _id
        name
        email
        createdAt
      }
      likes {
        _id
        createdAt
      }
      createdAt
    }
  }
`;

const LIKE_POST = gql`
  mutation likePost(
    $id: ID!
    $name: String!
    $email: String!
    $profilePic: String!
  ) {
    likePost(id: $id, name: $name, email: $email, profilePic: $profilePic) {
      _id
      content
      image
      createdAt
      likes {
        _id
        createdAt
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation addComment(
    $postId: ID!
    $body: String!
    $name: String!
    $email: String!
    $profilePic: String!
  ) {
    createComment(
      postId: $postId
      body: $body
      name: $name
      email: $email
      profilePic: $profilePic
    ) {
      _id
      content
      likes {
        _id
        createdAt
      }
      comments {
        _id
        name
        body
        createdAt
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $content: String, $image: String) {
    updatePost(id: $id, content: $content, image: $image) {
      _id
      content
      image
      createdAt
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export { ADD_POST, LIKE_POST, ADD_COMMENT, UPDATE_POST, DELETE_POST };
