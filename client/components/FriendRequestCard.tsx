import React from 'react'
import moment from 'moment'
import { useMutation } from '@apollo/client'
import { ACCEPT_FRIEND_REQUEST } from '../graphql/mutations/userMutations'
import toast from 'react-hot-toast'
import { useStateContext } from '../context/StateContext'

interface Props {
  user: friendRequests
  refresh: () => Promise<void>
}

const FriendRequestCard = ({ user, refresh }: Props) => {
  const { currentUser } = useStateContext()
  const { token } = currentUser || {}

  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    variables: {
      email: user.email,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  })

  const handleRequest = async () => {
    try {
      await acceptFriendRequest()
      toast.success(`${user.name}'s friend Request accepted Successfully!!`)
      await refresh()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    <div className="mt-10 flex flex-1 items-center rounded-md border border-gray-200 bg-white p-5">
      <div className="flex-[0.2]">
        <img
          src={user.profilePic}
          alt=""
          className="h-20 w-20 rounded-full bg-white object-contain md:h-32 md:w-32"
        />
      </div>
      <div className="ml-5 flex flex-[0.8] flex-col">
        <div className="flex flex-1 items-center justify-between border-b-[1px] border-b-gray-400">
          <div>
            <p className="text-lg font-bold md:text-xl">{user.name}</p>
            <p className="md:text-md text-sm font-semibold text-gray-500">
              {user.email}
            </p>
          </div>
          <div className="text-sm font-light text-gray-400">
            {moment(user.createdAt).fromNow()}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            className="m-2 flex flex-1 items-center justify-center rounded-lg bg-blue-700 px-2 py-1 text-white hover:bg-blue-500 md:px-4 md:py-2"
            onClick={handleRequest}
          >
            Accept
          </button>
          <button className="m-2 flex flex-1 items-center justify-center rounded-lg bg-purple-600 px-2 py-1 text-white hover:bg-purple-400 md:px-4 md:py-2 ">
            View
          </button>
          <button className="m-2 flex flex-1 items-center justify-center rounded-lg bg-red-600 px-2 py-1 text-white hover:bg-red-400 md:px-4 md:py-2">
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

export default FriendRequestCard
