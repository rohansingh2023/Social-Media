import { GraphQLClient, request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { GET_CONVERSATIONS_OF_A_USER } from '../graphql/queries/convQueries'
import {
  GET_POSTS,
  GET_POSTS_BY_USER_ID,
  GET_POST_BY_ID,
} from '../graphql/queries/postQueries'
import {
  GET_FRIEND_REQUESTS,
  GET_ONLY_USERS,
  GET_ONLY_USERS_EX_ME,
  GET_USERS,
  GET_USER_BY_ID,
  SEARCH_USERS,
} from '../graphql/queries/userQueries'
import client from '../apollo-client'

// const GRAPHQL_ENDPOINT = 'https://sm-graphql-api.onrender.com/api'
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql'
const authClient = new GraphQLClient(GRAPHQL_ENDPOINT, {})

export const getPosts = async () => {
  const results = await request(GRAPHQL_ENDPOINT, GET_POSTS)
  return results.posts
}

export const getUsers = async () => {
  const results = await request(GRAPHQL_ENDPOINT, GET_USERS)
  return results.users
}

export const getUserById = async (id: any) => {
  const results = await request(GRAPHQL_ENDPOINT, GET_USER_BY_ID, { id })
  // const results = await authClient.request(GET_USER_BY_ID, { id })
  // const { data } = await client.query({
  //   query: GET_USER_BY_ID,
  //   variables: {
  //     id,
  //   },
  // })
  return results.userById
}

export const getPostsByUserId = async (id: any) => {
  const results = await request(GRAPHQL_ENDPOINT, GET_POSTS_BY_USER_ID, { id })
  return results.postByUserId
}

export const getOnlyUsers = async () => {
  const results = await request(GRAPHQL_ENDPOINT, GET_ONLY_USERS)
  return results.onlyUsers
}

export const getOnlyUsersExMe = async () => {
  const [currentUser, setCurrentUser] = useState([])

  useEffect(() => {
    const user = localStorage.getItem('authUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const { token }: any = currentUser || {}

  const results = await request(GRAPHQL_ENDPOINT, GET_ONLY_USERS_EX_ME, {
    Headers: {
      Authorization: `${token}`,
    },
  })
  return results.onlyUsersExcludingMe
}

export const getPostById = async (id: any) => {
  const results = await request(GRAPHQL_ENDPOINT, GET_POST_BY_ID, { id })
  return results.postById
}

export const getSearchUsers = async (searchTerm: any) => {
  const results = await request(GRAPHQL_ENDPOINT, SEARCH_USERS, { searchTerm })
  return results.searchUsers
}

export const getFriendRequests = async (id: any) => {
  const results = await request(GRAPHQL_ENDPOINT, GET_FRIEND_REQUESTS, { id })
  return results.userById.user.friendRequests
}

export const getConversationsOfAUser = async (id: any) => {
  const results = await request(GRAPHQL_ENDPOINT, GET_CONVERSATIONS_OF_A_USER, {
    id,
  })
  return results.getConversations
}
