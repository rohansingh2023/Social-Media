import React from 'react'
import { Leftbar, Navbar, Rightbar } from '../../components'
import UserProfile from '../../components/UserProfile'
import { getUserById, getUsers } from '../../services'

const Profile = ({ userIdData }: any) => {
  return (
    <div className="grid-rows-10 grid font-PtSans">
      <header className="z-50 row-span-1">
        <Navbar />
      </header>
      <div className="row-span-9 grid grid-cols-12">
        <Leftbar />
        <UserProfile userD={userIdData.user} post={userIdData.posts} />
        <Rightbar />
      </div>
    </div>
  )
}

export async function getStaticProps({ params }: any) {
  const userIdData = (await getUserById(params.id)) || []
  return {
    props: {
      userIdData,
    },
  }
}

export async function getStaticPaths() {
  const userData = (await getUsers()) || []
  return {
    paths: userData.map((user: { user: any }) => ({
      params: { id: user.user.id },
    })),
    fallback: true,
  }
}

export default Profile
