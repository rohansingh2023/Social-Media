import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/StateContext'
import moment from 'moment'
import client from '../../apollo-client'
import { GET_USER_BY_ID } from '../../graphql/queries/userQueries'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/activities/userRedux'
import { useCurrentState } from '../../state-management/zustand'
import Image from 'next/image'

interface IProps {
  message: Message
  receiverId: any
}

const MessageCard = ({ message, receiverId }: IProps) => {
  const currentUser = useCurrentState((state) => state.currentUser)
  const [otherUser, setOtherUser] = useState<User>()

  useEffect(() => {
    const getOtherUser = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_BY_ID,
          variables: {
            id: receiverId,
          },
        })
        setOtherUser(data?.userById?.user)
      } catch (error) {}
    }
    getOtherUser()
  }, [])

  return (
    <>
      {message.sender === currentUser?.user?._id ? (
        <div className="flex flex-col items-end">
          <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
            {currentUser?.user?.profilePic && (
              <Image
                src={currentUser?.user?.profilePic}
                alt=""
                height={40}
                width={40}
                className="h-10 w-10 flex-[0.12] rounded-full object-cover"
              />
            )}
            <div className="flex-[0.88]">
              <p className="rounded-r-md rounded-b-md bg-[#FF8080] p-2 text-white">
                {message.text}
              </p>
              <p className="text-sm font-light text-gray-500">
                {moment(message.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start">
          <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
            {otherUser?.profilePic && (
              <Image
                src={otherUser?.profilePic}
                alt=""
                height={40}
                width={40}
                className="h-10 w-10 flex-[0.12] rounded-full object-cover"
              />
            )}
            <div className="flex-[0.88]">
              <p className="rounded-r-md rounded-b-md bg-gray-200 p-2 text-left">
                {message.text}
              </p>
              <p className="text-sm font-light text-gray-500">
                {moment(message.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MessageCard
