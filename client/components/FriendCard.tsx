import { useMutation } from '@apollo/client'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
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
  const router = useRouter()

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
      // await refresh()
      router.reload()
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
        <h1 className="ml-3 text-base text-gray-500">{user.name}</h1>
      </div>
      <div className="flex items-center">
        <Link href={`/user/${user.userId}`}>
          <button className="m-3 rounded-md bg-blue-500 py-1 px-2 text-sm text-white hover:bg-blue-700">
            View
          </button>
        </Link>
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
