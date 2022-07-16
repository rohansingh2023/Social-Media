import React, { Dispatch, SetStateAction } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { AiOutlineSearch } from 'react-icons/ai'
import ChatListCard from './ChatListCard'

interface IProps {
  user: User
  isChatOpen: boolean
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
}

const ChatSidebar = ({ user, isChatOpen, setIsChatOpen }: IProps) => {
  return (
    <div
      className={
        isChatOpen
          ? 'hidden bg-white font-Inter md:col-span-3 md:inline'
          : 'col-span-10 bg-white font-Inter md:col-span-3'
      }
    >
      {/* Chat header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h1 className="text-2xl font-bold">Chats</h1>
        <FiMoreHorizontal
          size={30}
          color="gray"
          className="rounded-full p-1 hover:bg-gray-300"
        />
      </div>

      {/* SearchBar */}
      <div className="mx-4 mt-2 flex items-center rounded-full bg-gray-200 px-3 py-2">
        <AiOutlineSearch />
        <input
          type="text"
          placeholder="Search Chats"
          className="ml-2 flex-1 bg-gray-200 outline-none placeholder:text-gray-600"
        />
      </div>

      {/* Chat List */}
      <div className="h-[77vh] cursor-pointer overflow-y-scroll py-2">
        {user?.friends?.map((u) => (
          <ChatListCard key={u.id} user={u} setIsChatOpen={setIsChatOpen} />
        ))}
      </div>
    </div>
  )
}

export default ChatSidebar
