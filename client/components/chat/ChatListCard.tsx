import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import client from '../../apollo-client'
import { GET_USER_BY_ID } from '../../graphql/queries/userQueries'
import { socket } from '../../socket'
import { useCurrentState } from '../../state-management/zustand'

interface IProps {
  conv: Conversation
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
  setCurrentChat: Dispatch<any>
}

const ChatListCard = ({ setIsChatOpen, conv, setCurrentChat }: IProps) => {
  const currentUser = useCurrentState((state) => state.currentUser)
  const [convChats, setConvChats] = useState<User>()

  useEffect(() => {
    const friendId = conv?.members?.find((m) => m !== currentUser?.user?._id)

    const getUser = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_BY_ID,
          variables: {
            id: friendId,
          },
        })
        setConvChats(data?.userById?.user)
      } catch (error) {}
    }
    getUser()
  }, [currentUser, conv])

  const setCreds = () => {
    setIsChatOpen(true)
    setCurrentChat(conv)
    socket.emit('addUser', { room: conv?._id })
  }

  return (
    <div
      className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter hover:bg-gray-100"
      onClick={setCreds}
    >
      <img
        src={convChats?.profilePic}
        alt=""
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="ml-3 flex flex-col">
        <h1 className="text-sm font-semibold">{convChats?.name}</h1>
        <p className="text-xs font-light">{convChats?.email}</p>
      </div>
    </div>
  )
}

export default ChatListCard
