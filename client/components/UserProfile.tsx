import React, { useEffect, useState } from 'react'
import { GiThreeFriends } from 'react-icons/gi'
import { FcAbout } from 'react-icons/fc'
import { BsSignpost } from 'react-icons/bs'
import Post from './Post'
import { getPostsByUserId } from '../services'
import Loading from './Loading'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { IoPencilSharp } from 'react-icons/io5'

interface Props {
  userD: User
  post: Post
}

interface Props2 {
  posts: Post
  user: User
}

function UserProfile({ userD, post }: Props) {
  const [userPosts, setUserPosts] = useState<Props2[]>([])
  const router: NextRouter = useRouter()

  useEffect(() => {
    const getUserById = async () => {
      const results: Props2[] = await getPostsByUserId(userD.id)
      setUserPosts(results)
    }
    getUserById()
  }, [])

  console.log(userPosts)

  if (!userPosts) {
    return <Loading />
  }

  return (
    <div className="col-span-6 flex max-h-screen flex-1 flex-col overflow-scroll scrollbar-hide lg:border-x lg:p-5">
      <div className="mt-5 flex flex-1 flex-shrink-0 flex-col lg:mt-0">
        <div className="h-80 w-full flex-shrink-0 rounded-t-md bg-white opacity-70">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.zsEgRepQ6Uh5OYkkhJyn2gHaE5&pid=Api&P=0&w=253&h=167"
            alt=""
            className="h-full w-full rounded-t-md object-cover"
          />
        </div>
        <div className="h-64 w-full rounded-b-md bg-white shadow-lg lg:h-40">
          <div className="flex flex-col lg:flex-row">
            {/* <div> */}
            <img
              src={userD.profilePic}
              alt=""
              className="z-50 -mt-10 ml-14 h-40 w-40 rounded-full object-fill md:ml-10 lg:ml-5"
            />
            {/* </div> */}
            <div className="relative ml-5 flex flex-1 flex-col ">
              <h2 className="text-xl font-bold text-slate-800">{userD.name}</h2>
              <p className="text-sm font-thin text-gray-400">{userD.email}</p>
              <div className=" flex flex-1">
                <div className="flex flex-1 flex-col">
                  <p className="text-md mt-3 font-semibold text-gray-400">
                    {userD.friends.length} friends
                  </p>
                  <div className="flex items-center">
                    {userD?.friends.map((u) => (
                      <img
                        src={u.profilePic}
                        alt=""
                        className=" h-7 w-7 rounded-full object-fill"
                      />
                    ))}
                  </div>
                </div>
                <button className="absolute right-7 bottom-0 flex h-10 items-center justify-center rounded-md bg-gray-300 p-3 text-center font-semibold outline-none hover:bg-gray-400">
                  <IoPencilSharp />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={userPosts.length > 0 ? 'p-5' : 'mt-10 p-5'}>
        <hr className="mt-10 border bg-black" />
      </div>
      <div className="mx-auto max-w-xl">
        {userD.friends.length > 0 && (
          <div className="mx-auto flex w-11/12 flex-col bg-slate-100 p-5">
            <h1 className="text-2xl font-bold">FriendsList</h1>
            <div className="mt-2 max-h-40 max-w-xl overflow-y-scroll rounded-md bg-white p-3">
              {userD.friends.map((u) => (
                // <Link href={`/user/${u.id}`}>
                <div className="mt-2 flex cursor-pointer items-center rounded-sm py-2 px-2 hover:bg-gray-200">
                  <img
                    src={u.profilePic}
                    alt=""
                    className="h-7 w-7 rounded-full object-fill"
                  />
                  <h1 className="ml-3 font-thin text-gray-700">{u.name}</h1>
                </div>
                // </Link>
              ))}
            </div>
          </div>
        )}
        {userD.friendRequests.length > 0 && (
          <div className="mx-auto mt-3 flex w-11/12 flex-col bg-slate-100 p-5">
            <h1 className="text-2xl font-bold">FriendsRequests</h1>
            <div className="mt-2 ml-32 max-h-40 max-w-sm overflow-y-scroll rounded-md bg-white p-3">
              {userD.friendRequests.map((u) => (
                // <Link href={`/user/${u.id}`}>
                <div className="mt-2 flex cursor-pointer items-center rounded-sm py-2 px-2 hover:bg-gray-200">
                  <img
                    src={u.profilePic}
                    alt=""
                    className="h-7 w-7 rounded-full object-fill"
                  />
                  <h1 className="ml-3 font-thin text-gray-700">{u.name}</h1>
                </div>
                // </Link>
              ))}
            </div>
          </div>
        )}
        {/* <div className="flex flex-col items-center lg:p-5"> */}
        {userPosts.length > 0 ? (
          userPosts?.map((post: { user: User; posts: Post }) => (
            <Post user={post.user} post={post.posts} />
          ))
        ) : (
          <h1 className="mt-5 text-center text-lg font-bold text-black">
            No posts to show
          </h1>
        )}
      </div>
    </div>
  )
}

export default UserProfile
