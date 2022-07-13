import { useQuery } from '@apollo/client'
import React from 'react'
import {
  FriendRequestContainer,
  Leftbar,
  Navbar,
  Rightbar,
} from '../components'
import Loading from '../components/Loading'
import { useStateContext } from '../context/StateContext'
import { GET_FRIEND_REQUESTS } from '../graphql/queries/userQueries'

const friendRequest = () => {
  const { currentUser } = useStateContext()
  const { user } = currentUser || {}
  const { id } = user || {}

  const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS, {
    variables: {
      id,
    },
  })

  const userData: friendRequests[] = data?.userById?.user?.friendRequests

  // if (loading) {
  //   return <Loading />
  // }

  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden bg-gray-100 font-DMSerif">
      <header className="z-50 row-span-1">
        <Navbar />
      </header>
      <div className="row-span-9 grid grid-cols-12">
        <Leftbar />
        {/* <SearchFriends userData={userData} /> */}
        <FriendRequestContainer user={userData} />
        <Rightbar />
      </div>
    </div>
  )
}

export default friendRequest
