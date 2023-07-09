import axios from 'axios'
import client from '../apollo-client'
import { GET_FRIEND_REQUESTS } from '../graphql/queries/userQueries'

export const getFriendRequest = async (id: any) => {
  const data = await client.query({
    query: GET_FRIEND_REQUESTS,
    variables: {
      id,
    },
  })
  return data
}

export const getConverstaions = async (id: any, setConversations) => {
  const res = await axios.get(`http://localhost:3001/api/conversation/${id}`)
  setConversations(res.data)
  return res.data
}

export const getConverstaionOfAUser = async (id, setMyConvs) => {
  const res = await axios.get(`http://localhost:3001/api/conversation/${id}`)
  setMyConvs(res.data)
  return res.data
}

export const getMessages = async (id, setMessages) => {
  const res = await axios.get(`http://localhost:3001/api/message/${id}`)
  setMessages(res.data)
  return res.data
}
