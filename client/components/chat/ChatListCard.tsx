import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import client from '../../apollo-client'
import { useStateContext } from '../../context/StateContext'
import { GET_USER_BY_ID } from '../../graphql/queries/userQueries'
import { socket } from '../../socket'

interface IProps {
  conv: Conversation
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
  setCurrentChat: Dispatch<any>
}

const ChatListCard = ({ setIsChatOpen, conv, setCurrentChat }: IProps) => {
  const { currentUser } = useStateContext()
  const [convChats, setConvChats] = useState<User>()

  useEffect(() => {
    const friendId = conv?.members.find((m) => m !== currentUser?.user?.id)

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

  console.log(conv?._id)

  return (
    <div
      className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter hover:bg-gray-100"
      onClick={setCreds}
    >
      <img
        src={convChats?.profilePic}
        alt=""
        className="h-16 w-16 rounded-full object-cover"
      />
      <div className="ml-3 flex flex-col">
        <h1 className="font-semibold">{convChats?.name}</h1>
        <p className="text-sm font-light">{convChats?.email}</p>
      </div>
    </div>
  )
}

export default ChatListCard
