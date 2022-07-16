import React, { Dispatch, SetStateAction } from 'react'

interface IProps {
  user: friends
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
}

const ChatListCard = ({ user, setIsChatOpen }: IProps) => {
  return (
    <div
      className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter hover:bg-gray-100"
      onClick={() => setIsChatOpen(true)}
    >
      <img
        src={user?.profilePic}
        alt=""
        className="h-16 w-16 rounded-full object-cover"
      />
      <div className="ml-3 flex flex-col">
        <h1 className="font-semibold">{user?.name}</h1>
        <p className="text-sm font-light">{user?.email}</p>
      </div>
    </div>
  )
}

export default ChatListCard
