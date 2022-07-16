import React from 'react'
import ChatListCard from './ChatListCard'

const ChatInfo = () => {
  return (
    <div className="hidden max-h-[91vh] bg-white lg:col-span-2 lg:inline">
      <div className=" px-3 py-2 font-Inter">
        <h1 className="text-2xl font-bold">Active Users</h1>
      </div>
      <div className="max-h-[83vh] overflow-y-scroll scrollbar-hide">
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
        <ChatListCard />
      </div>
    </div>
  )
}

export default ChatInfo
