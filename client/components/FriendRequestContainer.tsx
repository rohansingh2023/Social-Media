import { useQuery } from '@apollo/client'
import { RefreshIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import client from '../apollo-client'
import { useStateContext } from '../context/StateContext'
import { GET_FRIEND_REQUESTS } from '../graphql/queries/userQueries'
import { getFriendRequests } from '../services'
import FriendRequestCard from './FriendRequestCard'
import Loading from './Loading'

interface Props {
  user: friendRequests[]
}

const FriendRequestContainer = ({ user: u }: Props) => {
  const [fRequests, setFRequests] = useState<friendRequests[]>(u)
  const { currentUser } = useStateContext()
  const { user } = currentUser || {}
  const { id } = user || {}

  const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS, {
    variables: {
      id,
    },
  })

  useEffect(() => {
    const users: friendRequests[] = data?.userById?.user?.friendRequests
    setFRequests(users)
  }, [data])

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...')
    const userInfo = await getFriendRequests(id)
    setFRequests(userInfo)
    toast.success('Friend Requests Updated', {
      id: refreshToast,
    })
  }

  if (!fRequests) {
    return <Loading />
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="col-span-6 flex flex-col border-x p-5">
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Pending Requests{' '}
            <span className="ml-3 rounded-full bg-purple-500 px-2 text-white shadow-md">
              {fRequests.length}
            </span>
          </h1>
        </div>
        <div>
          <RefreshIcon
            onClick={handleRefresh}
            className="h-8 w-8 cursor-pointer text-purple-600 transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          />
        </div>
      </div>
      <hr className="mt-10 border bg-gray-300" />
      <div className="flex w-full flex-col px-7 py-2">
        {fRequests.length > 0 ? (
          fRequests.map((f) => (
            <FriendRequestCard user={f} key={f.id} refresh={handleRefresh} />
          ))
        ) : (
          <span>No Friends Requests to show</span>
        )}
      </div>
    </div>
  )
}

export default FriendRequestContainer
