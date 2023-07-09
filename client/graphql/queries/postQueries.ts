import { gql } from '@apollo/client'

const GET_POSTS = gql`
  query getPosts {
    posts {
      posts {
        _id
        user
        content
        image
        comments {
          _id
          name
          body
          email
          createdAt
        }
        likes {
          _id
          createdAt
          email
          name
        }
        createdAt
      }
      user {
        _id
        name
        email
        profilePic
        dob
        bio
      }
    }
  }
`

const GET_POSTS_BY_USER_ID = gql`
  query getPostsByUserId($id: ID!) {
    postByUserId(id: $id) {
      posts {
        _id
        user
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
      user {
        _id
        name
        email
        profilePic
        dob
        bio
      }
    }
  }
`

const GET_POST_BY_ID = gql`
  query getPostById($id: ID!) {
    postById(id: $id) {
      user {
        _id
        name
        email
        profilePic
      }
      posts {
        _id
        user
        content
        createdAt
        image
        likes {
          _id
          createdAt
        }
        comments {
          body
          _id
          name
          createdAt
        }
      }
    }
  }
`

export { GET_POSTS, GET_POSTS_BY_USER_ID, GET_POST_BY_ID }
