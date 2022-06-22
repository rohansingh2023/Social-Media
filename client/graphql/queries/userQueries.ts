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
        comments {
          id
          body
          createdAt
          name
          email
        }
        likes {
          id
          createdAt
        }
      }
    }
  }
`

const GET_USERS_EX_ME = gql`
  query users {
    usersExcludingMe {
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
        comments {
          id
          body
          createdAt
          name
          email
        }
        likes {
          id
          createdAt
        }
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
        comments {
          id
          body
          createdAt
          name
          email
        }
        image
        content
        likes {
          id
          createdAt
        }
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
        comments {
          id
          body
          createdAt
          name
          email
        }
        content
        image
        likes {
          id
          createdAt
        }
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

const GET_ONLY_USERS_EX_ME = gql`
  query onlyUsers {
    onlyUsersExcludingMe {
      id
      name
      email
      profilePic
      bio
      dob
    }
  }
`

const SEARCH_USERS = gql`
  query searchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      users {
        id
        name
        email
        profilePic
        bio
        dob
      }
      totalCount
    }
  }
`

export {
  GET_USERS,
  GET_USER_BY_ID,
  CURRENT_USER,
  GET_ONLY_USERS,
  SEARCH_USERS,
  GET_ONLY_USERS_EX_ME,
  GET_USERS_EX_ME,
}
