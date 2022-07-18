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
      posts {
        id
        content
        image
        user
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
        user
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
          userId
          email
          profilePic
          createdAt
        }
      }
      posts {
        id
        user
        comments {
          id
          body
          createdAt
          name
          email
        }
        image
        content
        createdAt
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
        user
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
      friends {
        id
        userId
        name
        email
        profilePic
        createdAt
      }
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

const GET_FRIEND_REQUESTS = gql`
  query getFriendRequests($id: ID!) {
    userById(id: $id) {
      user {
        friendRequests {
          id
          name
          userId
          email
          profilePic
          createdAt
        }
      }
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
  GET_FRIEND_REQUESTS,
}
