import { GetServerSideProps } from 'next'
import React from 'react'
import { Navbar } from '../../components'
import ChatMain from '../../components/chat'
import { getUserById } from '../../services'

interface IProps {
  userData: {
    user: User
    posts: Post[]
  }
}

const Chat = ({ userData: { user, posts } }: IProps) => {
  return (
    <div>
      <Navbar />
      <ChatMain user={user} />
    </div>
  )
}

export default Chat

export const getServerSideProps = async ({ params: { id } }) => {
  const user = (await getUserById(id)) || []

  return {
    props: {
      userData: user,
    },
  }
}
