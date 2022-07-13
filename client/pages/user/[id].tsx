import React, { useState } from 'react'
import { Navbar, Post } from '../../components'
import UserProfile from '../../components/UserProfile'
import { getUserById, getUsers } from '../../services'

interface Props {
  userIdData: {
    user: User
    posts: Post[]
  }
}

function UserInfo({ userIdData: { user, posts } }: Props) {
  const [isHidden, setIsHidden] = useState<boolean>(false)

  return (
    <div className="grid-row-10 grid font-DMSerif">
      <div className="row-span-1">
        <Navbar />
      </div>
      <div className="row-span-9 mx-auto w-screen max-w-7xl overflow-scroll lg:max-h-screen lg:overflow-hidden">
        <div className="flex h-full flex-col lg:flex-row">
          <div className="mt-24 flex flex-col items-center justify-center lg:mt-0 lg:h-full lg:flex-[0.4]  lg:border-r">
            <img
              src={user.profilePic}
              alt=""
              className="h-64 w-64 rounded-full object-cover"
            />
            <div className="mt-7 flex flex-col justify-center p-3 font-Rubik text-xl font-semibold">
              <p className="p-2">{user.name}</p>
              <p className="p-2">{user.email}</p>
              <p className="p-2">Went to Harvard School</p>
              <p className="p-2">🎁 {user.dob}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col overflow-scroll p-3 scrollbar-hide  lg:flex-[0.6]">
            <div className="flex items-center justify-center rounded-lg bg-slate-300 p-5 text-center font-Rubik">
              <p className={user.bio.length > 100 ? 'text-md' : 'text-xl'}>
                {user.bio}
              </p>
            </div>
            <div className="flex p-5">
              <button
                className="w-1/2 rounded-md bg-slate-300  p-3"
                onClick={() => setIsHidden(false)}
              >
                See Friends
              </button>
              <button className="ml-3 w-1/2 rounded-md bg-slate-300 p-3 outline-none">
                Update Profile
              </button>
            </div>
            <div className="flex flex-col items-center justify-center transition-shadow duration-200 ">
              {posts.length > 0 ? (
                posts?.map((post) => <Post user={user} post={post} />)
              ) : (
                <span>No posts to show</span>
              )}
            </div>
          </div>
        </div>
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

export default UserInfo
