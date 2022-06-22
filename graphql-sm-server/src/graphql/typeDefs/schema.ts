import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date
  type Post {
    id: ID!
    content: String!
    image: String!
    likes: [like]!
    comments: [comment]!
    createdAt: Date
    updatedAt: String
    # user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    profilePic: String!
    dob: String!
    bio: String!
    friendRequests: [FriendRequest]!
    friends: [Friend]!
    # posts: [Post]
  }

  type AuthData {
    token: String
    user: User
    message: String
  }

  type AllPostData {
    posts: Post
    user: User
  }

  type UserData {
    user: User
    posts: [Post]
  }

  type like {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type comment {
    id: ID!
    name: String!
    email: String!
    body: String!
    createdAt: String!
  }

  type SearchUsers {
    users: [User]!
    totalCount: Int!
  }

  type FriendRequest {
    id: ID!
    userId: ID!
    name: String!
    email: String!
    createdAt: String!
    profilePic: String!
  }

  type Friend {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    profilePic: String!
  }

  type Query {
    hello: String
    posts: [AllPostData]!
    postById(id: ID!): AllPostData!
    currentUser: UserData!
    userById(id: ID!): UserData!
    users: [UserData]!
    postByUserId(id: ID!): [AllPostData!]!
    onlyUsers: [User!]!
    searchUsers(searchTerm: String!): SearchUsers!
    friendRequests: [FriendRequest]!
    friends: [Friend]!
    onlyUsersExcludingMe: [User!]!
    usersExcludingMe: [UserData!]!
  }

  type Mutation {
    addPost(content: String!, image: String!): Post!
    updatePost(id: ID!, content: String, image: String): Post!
    deletePost(id: ID!): Boolean!
    register(
      name: String!
      email: String!
      password: String!
      profilePic: String!
      dob: String!
      bio: String!
    ): AuthData!
    login(email: String!, password: String!): AuthData!
    likePost(id: ID!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    friendRequest(id: ID!): User!
    acceptFriendRequest(email: String!): User!
    # deleteFriendRequest(id: ID!): User!
  }
`;

export default typeDefs;
