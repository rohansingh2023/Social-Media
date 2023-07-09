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
      message
      token
    }
  }
`

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      token
    }
  }
`

const LOGOUT = gql`
  mutation logout {
    logout
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
      _id
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
      _id
      name
      email
      profilePic
      friendRequests {
        _id
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
      _id
      name
      email
      friendRequests {
        _id
        name
        email
      }
      friends {
        _id
        name
        email
      }
    }
  }
`

const DECLINE_FRIEND_REQUEST = gql`
  mutation declineFriendRequest($email: String!) {
    declineFriendRequest(email: $email) {
      _id
      name
      email
    }
  }
`

const UNFRIEND = gql`
  mutation unFriend($email: String!) {
    unFriend(email: $email) {
      _id
      name
      friends {
        _id
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
  LOGOUT,
}
