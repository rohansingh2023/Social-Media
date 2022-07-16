import React, { useState } from 'react'
import ChatInfo from './ChatInfo'
import ChatSection from './ChatSection'
import ChatSidebar from './ChatSidebar'

interface IProps {
  user: User
}

const ChatMain = ({ user }: IProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

  return (
    <div className="grid max-h-[91vh] grid-cols-10 overflow-hidden">
      <ChatSidebar
        user={user}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
      />
      <ChatSection isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <ChatInfo />
    </div>
  )
}

export default ChatMain
