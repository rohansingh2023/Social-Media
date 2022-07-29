import { useQuery } from '@apollo/client'
import React from 'react'
import { useSelector } from 'react-redux'
import {
  FriendRequestContainer,
  Leftbar,
  Navbar,
  Rightbar,
} from '../components'
import Loading from '../components/Loading'
import { useStateContext } from '../context/StateContext'
import { GET_FRIEND_REQUESTS } from '../graphql/queries/userQueries'
import { selectCurrentUser } from '../redux/activities/userRedux'

const friendRequest = () => {
  const currentUser = useSelector(selectCurrentUser)

  const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS, {
    variables: {
      id: currentUser?.id,
    },
  })

  const userData: friendRequests[] = data?.userById?.user?.friendRequests

  // if (loading) {
  //   return <Loading />
  // }

  return (
    <div className="max-h-screen overflow-hidden bg-gray-100 font-DMSerif">
      <header className="z-50 ">
        <Navbar />
      </header>
      <div className="grid grid-cols-12">
        <Leftbar />
        {/* <SearchFriends userData={userData} /> */}
        <FriendRequestContainer user={userData} />
        <Rightbar />
      </div>
    </div>
  )
}

export default friendRequest
