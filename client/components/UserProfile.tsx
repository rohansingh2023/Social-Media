import React, { useEffect, useState } from 'react'
import { GiThreeFriends } from 'react-icons/gi'
import { FcAbout } from 'react-icons/fc'
import { BsSignpost } from 'react-icons/bs'
import Post from './Post'
import { getPostsByUserId } from '../services'
import Loading from './Loading'
import Link from 'next/link'

type Props = {
  userD: {
    id: string
    name: string
    email: string
    profilePic: string
    bio: string
    dob: string
  }
  post: {
    id: string
    content: string
    image: string
    likes: [string]
    comments: [string]
  }
}

function UserProfile({ userD, post }: Props) {
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    const getUserById = async () => {
      const results = await getPostsByUserId(userD.id)
      setUserPosts(results)
    }
    getUserById()
  }, [])

  if (!userPosts) {
    return <Loading />
  }

  return (
    <div className="col-span-6 flex max-h-screen flex-1 flex-col overflow-scroll scrollbar-hide lg:border-x lg:p-5">
      <div className="flex flex-1 flex-shrink-0 flex-col">
        <div className="h-80 w-full flex-shrink-0 rounded-t-md bg-white opacity-70">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.zsEgRepQ6Uh5OYkkhJyn2gHaE5&pid=Api&P=0&w=253&h=167"
            alt=""
            className="h-full w-full rounded-t-md object-cover"
          />
        </div>
        <div className="h-40 w-full rounded-b-md bg-white shadow-lg">
          <div className="flex">
            <img
              src={userD.profilePic}
              alt=""
              className="z-50 -mt-10 ml-5 h-28 w-28 rounded-full"
            />
            <div className="ml-5 flex flex-col">
              <h2 className="text-xl font-bold text-slate-800">{userD.name}</h2>
              <p className="text-sm font-semibold text-gray-500">
                {userD.email}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-around">
            <button className=" flex w-36 items-center rounded-full bg-red-600 p-2 text-white shadow-xl outline-none hover:bg-red-400">
              <GiThreeFriends size={25} className="ml-3" />
              <span className="ml-3">Friends</span>
            </button>
            <Link href={`/user/${userD.id}`}>
              <button className=" flex w-36 items-center rounded-full bg-blue-600 p-2 text-white shadow-xl outline-none hover:bg-blue-400">
                <FcAbout size={25} className="ml-3" />
                <span className="ml-3">About</span>
              </button>
            </Link>
            <button className=" flex w-36 items-center rounded-full bg-green-600 p-2 text-white shadow-xl outline-none hover:bg-green-400">
              <BsSignpost size={25} className="ml-3" />
              <span className="ml-3">Posts</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <hr className="mt-10 border bg-black" />
      </div>
      {/* <div className="flex flex-col items-center lg:p-5"> */}
      {userPosts.length > 0 ? (
        userPosts?.map((post: { user: any; posts: any }) => (
          <Post user={post.user} post={post.posts} />
        ))
      ) : (
        <h1 className="text-center text-lg font-bold text-black">
          No posts to show
        </h1>
      )}
      {/* </div> */}
    </div>
  )
}

export default UserProfile
