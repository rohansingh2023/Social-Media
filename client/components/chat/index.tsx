import axios from 'axios'
import React, { useEffect, useState } from 'react'
import client from '../../apollo-client'
import { GET_CONVERSATIONS_OF_A_USER } from '../../graphql/queries/convQueries'
import { socket } from '../../socket'
import ChatInfo from './ChatInfo'
import ChatSection from './ChatSection'
import ChatSidebar from './ChatSidebar'

interface IProps {
  user: User
}

const ChatMain = ({ user }: IProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentChat, setCurrentChat] = useState<Conversation>()

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

  useEffect(() => {
    socket.on('test2', (data) => {
      alert(data.message)
    })
  }, [socket])

  return (
    <div className="mx-auto grid max-h-[91vh] grid-cols-12 overflow-hidden">
      <ChatSidebar
        user={user}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        conversations={conversations}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <ChatSection
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <ChatInfo user={user} conv={conversations} />
    </div>
  )
}

export default ChatMain
