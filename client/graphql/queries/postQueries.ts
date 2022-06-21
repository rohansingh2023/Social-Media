import { gql } from '@apollo/client'

const GET_POSTS = gql`
  query getPosts {
    posts {
      posts {
        id
        content
        image
        comments {
          id
          name
          email
          createdAt
        }
        likes {
          id
          createdAt
        }
        createdAt
      }
      user {
        id
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
        id
        content
        image
        comments {
          id
          name
          email
          createdAt
        }
        likes {
          id
          createdAt
        }
        createdAt
      }
      user {
        id
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
        id
        name
        email
        profilePic
      }
      posts {
        id
        content
        createdAt
        image
        likes {
          id
          createdAt
        }
        comments {
          body
          id
          name
          createdAt
        }
      }
    }
  }
`

export { GET_POSTS, GET_POSTS_BY_USER_ID, GET_POST_BY_ID }
