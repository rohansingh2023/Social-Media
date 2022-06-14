import { gql } from '@apollo/client'

const GET_POSTS = gql`
  query getPosts {
    posts {
      posts {
        id
        content
        image
        comments
        likes
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
        comments
        likes
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

export { GET_POSTS, GET_POSTS_BY_USER_ID }
