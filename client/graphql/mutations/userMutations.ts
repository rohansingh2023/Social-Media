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
      }
      token
    }
  }
`
export { REGISTER_USER, LOGIN_USER }
