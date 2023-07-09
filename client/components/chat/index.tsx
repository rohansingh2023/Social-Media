import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { socket } from '../../socket'
import dynamic from 'next/dynamic'
import { useQuery } from 'react-query'
import { getConverstaions } from '../../services/query-requests'

const ChatInfo = dynamic(() => import('./ChatInfo'), {
  loading: () => <p>Loading</p>,
})
const ChatSidebar = dynamic(() => import('./ChatSidebar'), {
  loading: () => <p>Loading</p>,
})
const ChatSection = dynamic(() => import('./ChatSection'), {
  loading: () => <p>Loading</p>,
})

interface IProps {
  user: User
}

const ChatMain = ({ user }: IProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentChat, setCurrentChat] = useState<Conversation>()

  const { data } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConverstaions(user?._id, setConversations),
  })

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
