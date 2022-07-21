import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import client from '../../apollo-client'
import { useStateContext } from '../../context/StateContext'
import { GET_USER_BY_ID } from '../../graphql/queries/userQueries'

interface IProps {
  conv: Conversation
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
}

const ChatListCard = ({ setIsChatOpen, conv }: IProps) => {
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

  return (
    <div
      className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter hover:bg-gray-100"
      onClick={() => setIsChatOpen(true)}
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
