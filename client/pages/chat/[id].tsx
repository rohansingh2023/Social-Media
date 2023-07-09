import axios from 'axios'
import { GetServerSideProps } from 'next'
import React, { useEffect } from 'react'
import { Navbar } from '../../components'
import ChatMain from '../../components/chat'
import { getConversationsOfAUser, getUserById } from '../../services'
import { socket } from '../../socket'
import { useCurrentState } from '../../state-management/zustand'

interface IProps {
  userData: {
    user: User
    posts: Post[]
    conv: any[]
  }
}

const Chat = ({ userData: { user, posts, conv } }: IProps) => {
  useEffect(() => {
    socket.on('userOnline', (data) => {
      console.log(data)
    })
  }, [socket])

  const addCurrentUser = useCurrentState((state) => state.addCurrentUser)
  // const currentUser = useCurrentState((state)=> state.currentUser);

  useEffect(() => {
    addCurrentUser()
  }, [])

  return (
    <div>
      <Navbar />
      <ChatMain user={user} />
    </div>
  )
}

export default Chat

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = (await getUserById(params?.id)) || []

  const res = await axios.get(
    `http://localhost:3001/api/conversation/${params?.id}`
  )
  const conv = res?.data

  return {
    props: {
      userData: user,
      conversations: conv,
    },
  }
}
