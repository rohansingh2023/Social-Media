import axios from 'axios'
import React, { useEffect, useState } from 'react'
import client from '../../apollo-client'
import { GET_CONVERSATIONS_OF_A_USER } from '../../graphql/queries/convQueries'
import ChatInfo from './ChatInfo'
import ChatSection from './ChatSection'
import ChatSidebar from './ChatSidebar'

interface IProps {
  user: User
}

const ChatMain = ({ user }: IProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const getConv = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/conversation/${user.id}`
        )
        setConversations(res.data)
      } catch (error) {}
    }
    getConv()
  }, [user.id])

  return (
    <div className="grid max-h-[91vh] grid-cols-10 overflow-hidden">
      <ChatSidebar
        user={user}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        conversations={conversations}
      />
      <ChatSection isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <ChatInfo />
    </div>
  )
}

export default ChatMain
