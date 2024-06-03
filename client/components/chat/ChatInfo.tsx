import React from 'react'
import dynamic from 'next/dynamic'

const ChatInfoCard = dynamic(() => import('./ChatInfoCard'), {
  loading: () => <p>Loading</p>,
})

interface IProps {
  user: User
  conv: Conversation[]
}

const ChatInfo = ({ user, conv }: IProps) => {
  return (
    <div className="hidden max-h-[91vh] bg-white md:col-span-3 md:inline">
      <div className=" px-3 py-2 font-Inter">
        <h1 className="text-2xl font-bold">Active Users</h1>
      </div>
      <div className="max-h-[83vh] cursor-pointer overflow-y-scroll scrollbar-hide">
        {user.friends.map((u) => (
          <ChatInfoCard key={u._id} friendInfo={u} />
        ))}
      </div>
    </div>
  )
}

export default ChatInfo
