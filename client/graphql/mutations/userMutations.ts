import { gql } from '@apollo/client'

const REGISTER_USER = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $password: String!
    $profilePic: String!
    $dob: String!
    $bio: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      profilePic: $profilePic
      dob: $dob
      bio: $bio
    ) {
      user {
        id
        name
        email
        profilePic
        dob
        bio
      }
      token
    }
  }
`

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
        profilePic
        dob
        bio
        friendRequests {
          id
          email
          name
          profilePic
          createdAt
        }
        friends {
          id
          name
          email
          profilePic
          createdAt
        }
      }
      token
    }
  }
`

const SEND_FRIEND_REQUEST = gql`
  mutation friendReq($id: ID!) {
    friendRequest(id: $id) {
      id
      name
      email
      profilePic
      friendRequests {
        id
        name
        email
        profilePic
      }
    }
  }
`

const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendReq($email: String!) {
    acceptFriendRequest(email: $email) {
      id
      name
      email
      friendRequests {
        id
        name
        email
      }
      friends {
        id
        name
        email
      }
    }
  }
`

export { REGISTER_USER, LOGIN_USER, ACCEPT_FRIEND_REQUEST, SEND_FRIEND_REQUEST }
