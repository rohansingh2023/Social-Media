import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date
  type Post {
    id: ID!
    content: String!
    image: String!
    likes: [like]!
    comments: [String]!
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
    createdAt: String!
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
  }

  type Mutation {
    addPost(content: String!, image: String!): Post!
    updatePost(id: ID!, content: String!, image: String!): Post!
    deletePost(id: ID!): Boolean!
    register(
      name: String!
      email: String!
      password: String!
      profilePic: String!
      dob: String!
      bio: String!
    ): String!
    login(email: String!, password: String!): AuthData!
    likePost(id: ID!): Post!
  }
`;

export default typeDefs;
