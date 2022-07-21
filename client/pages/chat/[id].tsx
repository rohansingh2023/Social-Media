import axios from 'axios'
import { GetServerSideProps } from 'next'
import React from 'react'
import { Navbar } from '../../components'
import ChatMain from '../../components/chat'
import { getConversationsOfAUser, getUserById } from '../../services'

interface IProps {
  userData: {
    user: User
    posts: Post[]
    conv: any[]
  }
}

const Chat = ({ userData: { user, posts, conv } }: IProps) => {
  console.log(conv)

  return (
    <div>
      <Navbar />
      <ChatMain user={user} />
    </div>
  )
}

export default Chat

export const getServerSideProps: GetServerSideProps = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const user = (await getUserById(id)) || []

  const res = await axios.get(`http://localhost:3001/api/conversation/${id}`)
  const conv = res?.data

  return {
    props: {
      userData: user,
      conversations: conv,
    },
  }
}
