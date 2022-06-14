import { gql } from '@apollo/client'

const REGISTER_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      user {
        _id
        name
        email
        profilePic
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
