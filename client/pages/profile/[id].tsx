import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { Leftbar, Navbar, Rightbar } from '../../components'
// import UserProfile from '../../components/UserProfile'
import { getUserById, getUsers } from '../../services'
import dynamic from 'next/dynamic'
import { useCurrentState } from '../../state-management/zustand'

const UserProfile = dynamic(() => import('../../components/UserProfile'), {
  loading: () => <p>Loading...</p>,
})

const Profile = ({ userIdData }: any) => {
  const addCurrentUser = useCurrentState((state) => state.addCurrentUser)

  useEffect(() => {
    addCurrentUser()
  }, [])
  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden bg-gray-100 font-DMSerif">
      <header className="z-50 row-span-1">
        <Navbar />
      </header>
      <div className="row-span-9 grid grid-cols-12">
        <Leftbar />
        <UserProfile userD={userIdData?.user} post={userIdData?.posts} />
        <Rightbar />
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const userIdData = (await getUserById(params.id)) || []
  return {
    props: {
      userIdData,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const userData = (await getUsers()) || []
  return {
    paths: userData.map((user: { user: any }) => ({
      params: { id: user.user._id },
    })),
    fallback: true,
  }
}

export default Profile
