import axios from 'axios'
import React from 'react'
import { useStateContext } from '../../context/StateContext'
import { HiOutlineUserAdd } from 'react-icons/hi'

interface IProps {
  friendInfo: friends
}

const ChatInfoCard = ({ friendInfo }: IProps) => {
  const { currentUser } = useStateContext()

  const handleConversation = async () => {
    try {
      const convDetails = {
        senderId: currentUser?.user?.id,
        receiverId: friendInfo.userId,
      }

      const res = await axios.post(
        'http://localhost:3001/api/conversation/',
        convDetails
      )
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter hover:bg-gray-100"
      onClick={handleConversation}
    >
      <img
        src={friendInfo.profilePic}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="ml-3 flex flex-1 items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="font-semibold">{friendInfo.name}</h1>
          <p className="text-sm font-light">{friendInfo.email}</p>
        </div>
        <div>
          <HiOutlineUserAdd size={25} />
        </div>
      </div>
    </div>
  )
}

export default ChatInfoCard
