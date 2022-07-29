import { useQuery } from '@apollo/client'
import { RefreshIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import client from '../apollo-client'
import { useStateContext } from '../context/StateContext'
import { GET_FRIEND_REQUESTS } from '../graphql/queries/userQueries'
import { selectCurrentUser } from '../redux/activities/userRedux'
import { getFriendRequests } from '../services'
import FriendRequestCard from './FriendRequestCard'
import Loading from './Loading'

interface Props {
  user: friendRequests[]
}

const FriendRequestContainer = ({ user: u }: Props) => {
  const [fRequests, setFRequests] = useState<friendRequests[]>(u)
  const currentUser = useSelector(selectCurrentUser)

  const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS, {
    variables: {
      id: currentUser?.id,
    },
  })

  useEffect(() => {
    const users: friendRequests[] = data?.userById?.user?.friendRequests
    setFRequests(users)
  }, [data])

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...')
    const userInfo = await getFriendRequests(currentUser?.id)
    setFRequests(userInfo)
    toast.success('Friend Requests Updated', {
      id: refreshToast,
    })
  }

  if (!fRequests) {
    return (
      <div className="col-span-12 lg:col-span-8 xl:col-span-6">
        <Loading />
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="col-span-12 flex max-h-[91vh] flex-col border-x bg-gray-200 p-5 lg:col-span-8 xl:col-span-6">
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Pending Requests{' '}
            <span className="ml-3 rounded-full bg-[#FF8080] px-2 text-white shadow-md">
              {fRequests.length}
            </span>
          </h1>
        </div>
        <div>
          <RefreshIcon
            onClick={handleRefresh}
            className="h-8 w-8 cursor-pointer text-[#FF8080] transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
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
