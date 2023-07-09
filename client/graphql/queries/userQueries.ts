import { gql } from '@apollo/client'

const HELLO = gql`
  query hello {
    hello
  }
`

const GET_USERS = gql`
  query users {
    users {
      user {
        _id
        name
        email
        profilePic
        dob
        bio
        friendRequests {
          _id
          email
          name
          profilePic
          createdAt
        }
        friends {
          _id
          name
          email
          profilePic
          createdAt
        }
      }
      posts {
        _id
        content
        image
        user
        comments {
          _id
          body
          createdAt
          name
          email
        }
        likes {
          _id
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
        _id
        name
        email
        profilePic
        dob
        bio
      }
      posts {
        _id
        user
        content
        image
        comments {
          _id
          body
          createdAt
          name
          email
        }
        likes {
          _id
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
        _id
        name
        email
        profilePic
        dob
        bio
        friendRequests {
          _id
          email
          userId
          name
          profilePic
          createdAt
        }
        friends {
          _id
          name
          userId
          email
          profilePic
          createdAt
        }
      }
      posts {
        _id
        user
        comments {
          _id
          body
          createdAt
          name
          email
        }
        image
        content
        createdAt
        likes {
          _id
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
        _id
        name
        email
        profilePic
        dob
        bio
        friendRequests {
          _id
          email
          userId
          name
          profilePic
          createdAt
        }
        friends {
          _id
          name
          userId
          email
          profilePic
          createdAt
        }
      }
      posts {
        _id
        user
        comments {
          _id
          body
          createdAt
          name
          email
        }
        content
        image
        likes {
          _id
          createdAt
        }
      }
    }
  }
`

const GET_ONLY_USERS = gql`
  query onlyUsers {
    onlyUsers {
      _id
      name
      email
      profilePic
      bio
      dob
      friends {
        _id
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
      _id
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
        _id
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
          _id
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
  HELLO,
  GET_USERS,
  GET_USER_BY_ID,
  CURRENT_USER,
  GET_ONLY_USERS,
  SEARCH_USERS,
  GET_ONLY_USERS_EX_ME,
  GET_USERS_EX_ME,
  GET_FRIEND_REQUESTS,
}
