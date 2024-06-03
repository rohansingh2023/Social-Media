// import { useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navbar } from '../components'
import Loading from '../components/Loading'
import { useStateContext } from '../context/StateContext'
import { GET_FRIEND_REQUESTS } from '../graphql/queries/userQueries'
import { selectCurrentUser } from '../redux/activities/userRedux'
import dynamic from 'next/dynamic'
import { useCurrentState } from '../state-management/zustand'
import { useQuery } from 'react-query'
import { getFriendRequests } from '../services'

const FriendReqCon = dynamic(
  () => import('../components/FriendRequestContainer'),
  {
    loading: () => <p>Loading...</p>,
  }
)

const Leftbar = dynamic(() => import('../components/Leftbar'), {
  // ssr: false,
  loading: () => <p>Loading...</p>,
})
const Rightbar = dynamic(() => import('../components/Rightbar'), {
  // ssr: false,
  loading: () => <p>Loading...</p>,
})

const friendRequest = () => {
  const currentUser = useCurrentState((state) => state.currentUser)
  const addCurrentUser = useCurrentState((state) => state.addCurrentUser)
  // const currentUser = useCurrentState((state)=> state.currentUser);

  useEffect(() => {
    addCurrentUser()
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['friendRequest'],
    queryFn: () => getFriendRequests(currentUser?.user?._id),
  })

  // const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS, {
  //   variables: {
  //     id: currentUser?.user?._id,
  //   },
  // })

  const userData: friendRequests[] = data?.userById?.user?.friendRequests

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="max-h-screen overflow-hidden bg-gray-100 font-DMSerif">
      <header className="z-50 ">
        <Navbar />
      </header>
      <div className="grid grid-cols-12">
        <Leftbar />
        {/* <SearchFriends userData={userData} /> */}
        <FriendReqCon user={userData} />
        <Rightbar />
      </div>
    </div>
  )
}

export default friendRequest
