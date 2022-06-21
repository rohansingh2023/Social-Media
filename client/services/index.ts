import { request } from 'graphql-request'
import {
  GET_POSTS,
  GET_POSTS_BY_USER_ID,
  GET_POST_BY_ID,
} from '../graphql/queries/postQueries'
import {
  GET_ONLY_USERS,
  GET_USERS,
  GET_USER_BY_ID,
  SEARCH_USERS,
} from '../graphql/queries/userQueries'

const GRAPHQL_ENDPOINT = 'http://localhost:4000/api'

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

export const getPostById = async (id: any) => {
  const results = await request(GRAPHQL_ENDPOINT, GET_POST_BY_ID, { id })
  return results.postById
}

export const searchUsers = async (searchTerm: any) => {
  const results = await request(GRAPHQL_ENDPOINT, SEARCH_USERS, { searchTerm })
  return results.searchUsers
}