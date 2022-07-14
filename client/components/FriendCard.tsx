import { useMutation } from '@apollo/client'
import React from 'react'
import toast from 'react-hot-toast'
import { useStateContext } from '../context/StateContext'
import { UNFRIEND } from '../graphql/mutations/userMutations'

interface IProps {
  user: friends
  refresh: () => Promise<void>
}

const FriendCard = ({ user, refresh }: IProps) => {
  const { currentUser } = useStateContext()
  const { token } = currentUser || {}

  const [unFriend] = useMutation(UNFRIEND, {
    variables: {
      email: user.email,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  })

  const handleUnFriend = async () => {
    try {
      const refreshToast = toast.loading('Unfriending...')
      await unFriend()
      toast.success(`${user.name} Unfriended successfully`, {
        id: refreshToast,
      })
      await refresh()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    <div className="mt-2 flex cursor-pointer items-center justify-between rounded-sm py-2 px-2 hover:bg-gray-200">
      <div className="flex items-center">
        <img
          src={user.profilePic}
          alt=""
          className="h-7 w-7 rounded-full object-fill"
        />
        <h1 className="ml-3 font-thin text-gray-700">{user.name}</h1>
      </div>
      <div className="flex items-center">
        <button className="m-3 rounded-md bg-blue-500 py-1 px-2 text-sm text-white hover:bg-blue-700">
          View
        </button>
        <button
          type="submit"
          className="m-3 rounded-md bg-red-500 py-1 px-2 text-sm text-white hover:bg-red-700"
          onClick={handleUnFriend}
        >
          UnFriend
        </button>
      </div>
    </div>
  )
}

export default FriendCard
