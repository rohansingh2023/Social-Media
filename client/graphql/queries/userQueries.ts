import { gql } from '@apollo/client'

const GET_USERS = gql`
  query users {
    users {
      user {
        id
        name
        email
        profilePic
        dob
        bio
      }
      posts {
        id
        content
        image
        comments
        likes
      }
    }
  }
`

const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    userById(id: $id) {
      user {
        id
        name
        email
        profilePic
        dob
        bio
      }
      posts {
        id
        comments
        image
        content
        likes
      }
    }
  }
`

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      user {
        id
        name
        email
        profilePic
        dob
        bio
      }
      posts {
        id
        comments
        content
        image
        likes
      }
    }
  }
`

const GET_ONLY_USERS = gql`
  query onlyUsers {
    onlyUsers {
      id
      name
      email
      profilePic
      bio
      dob
    }
  }
`

export { GET_USERS, GET_USER_BY_ID, CURRENT_USER, GET_ONLY_USERS }
