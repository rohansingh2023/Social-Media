import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/StateContext'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { selectCurrentUser } from '../../redux/activities/userRedux'
import { useSelector } from 'react-redux'

interface IProps {
  friendInfo: friends
}

const ChatInfoCard = ({ friendInfo }: IProps) => {
  const currentUser = useSelector(selectCurrentUser)
  const [myConvs, setMyConvs] = useState([])

  useEffect(() => {
    const getConvOfUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/conversation/${currentUser?.id}`
        )
        setMyConvs(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getConvOfUser()
  }, [currentUser?.id])

  // var array = [1, 3],
  //   prizes = [
  //     [1, 3],
  //     [1, 4],
  //   ],
  //   includes = prizes.some((a) => array.every((v, i) => v === a[i]))

  // console.log(includes)
  const abc = myConvs.some((a: any) =>
    a.members.every((v: any, i: any) => v === friendInfo.userId)
  )
  console.log(abc)

  const handleConversation = async () => {
    try {
      const convDetails = {
        senderId: currentUser?.id,
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

  console.log(myConvs)

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
