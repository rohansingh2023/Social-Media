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
          userId
          name
          profilePic
          createdAt
        }
        friends {
          id
          name
          email
          userId
          profilePic
          createdAt
        }
      }
      token
    }
  }
`

const UPDATE_USER = gql`
  mutation updateUser(
    $name: String!
    $email: String!
    $profilePic: String!
    $dob: String!
    $bio: String!
  ) {
    updateUser(
      name: $name
      email: $email
      profilePic: $profilePic
      dob: $dob
      bio: $bio
    ) {
      id
      name
      email
      profilePic
      bio
      dob
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

const DECLINE_FRIEND_REQUEST = gql`
  mutation declineFriendRequest($email: String!) {
    declineFriendRequest(email: $email) {
      id
      name
      email
    }
  }
`

const UNFRIEND = gql`
  mutation unFriend($email: String!) {
    unFriend(email: $email) {
      id
      name
      friends {
        id
        name
      }
    }
  }
`

export {
  REGISTER_USER,
  LOGIN_USER,
  ACCEPT_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
  UNFRIEND,
  DECLINE_FRIEND_REQUEST,
  UPDATE_USER,
}
