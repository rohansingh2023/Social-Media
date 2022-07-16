import React, { useState } from 'react'
import { IoPencilSharp } from 'react-icons/io5'
import { Navbar, Post } from '../../components'
import { FaUniversity, FaBirthdayCake } from 'react-icons/fa'
import { MdOutlineMail } from 'react-icons/md'
import { BiOutline } from 'react-icons/bi'
import { GrLocation } from 'react-icons/gr'
import UserProfile from '../../components/UserProfile'
import { getUserById, getUsers } from '../../services'
import { useStateContext } from '../../context/StateContext'
import { TiTick } from 'react-icons/ti'
import { RiAddLine } from 'react-icons/ri'

interface Props {
  userIdData: {
    user: User
    posts: Post[]
  }
}

function UserInfo({ userIdData: { user, posts } }: Props) {
  const [isHidden, setIsHidden] = useState<boolean>(false)

  const { currentUser } = useStateContext()
  const { user: cUser, token } = currentUser || {}

  const isFriend = cUser?.friends?.findIndex(
    (f) => f.userId.toString() === user.id.toString()
  )

  // const isRequestSent = cUser?.friendRequests?.findIndex(
  //   (f) => f.userId.toString() === user.id.toString()
  // )

  console.log(isFriend)

  return (
    <>
      <Navbar />

      <div className="h-auto bg-gray-200 font-Inter">
        {/* Top */}
        <div className="flex flex-col bg-white">
          <div className="mx-auto h-[400px] w-[75%] flex-shrink-0 rounded-t-md bg-white opacity-70">
            <img
              src="https://tse3.mm.bing.net/th?id=OIP.zsEgRepQ6Uh5OYkkhJyn2gHaE5&pid=Api&P=0&w=253&h=167"
              alt=""
              className="h-full w-full rounded-b-lg object-cover"
            />
          </div>
          <div className="mx-auto h-64 w-[70%] rounded-b-md lg:h-40">
            <div className="flex flex-col lg:flex-row">
              {/* <div> */}
              <img
                src={user.profilePic}
                alt=""
                className="z-50 -mt-10 ml-14 h-44 w-44 rounded-full object-cover md:ml-10 lg:ml-5"
              />
              {/* </div> */}
              <div className="relative ml-5 mt-5 flex flex-1 flex-col">
                <h2 className="text-3xl font-bold text-slate-800">
                  {user.name}
                </h2>
                <div className=" flex flex-1">
                  <div className="flex flex-1 flex-col">
                    <p className="mt-3 text-lg font-semibold text-gray-400">
                      {user.friends.length > 1
                        ? `${user.friends.length} friends`
                        : `${user.friends.length} friend`}
                    </p>
                    <div className="flex items-center">
                      {user?.friends.map((u) => (
                        <img
                          src={u.profilePic}
                          alt=""
                          className=" h-7 w-7 rounded-full object-cover"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      disabled={isFriend !== -1}
                      className="absolute right-32 bottom-0 flex h-10 items-center justify-center rounded-md bg-gray-300 p-3 text-center font-semibold outline-none hover:bg-gray-400"
                    >
                      {isFriend !== -1 ? <TiTick /> : <RiAddLine />}

                      {isFriend !== -1 ? 'Friends' : 'Add Friend'}
                    </button>
                    <button className="absolute right-7 bottom-0 flex h-10 items-center justify-center rounded-md bg-gray-300 p-3 text-center font-semibold outline-none hover:bg-gray-400">
                      <IoPencilSharp />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mx-auto flex max-w-5xl">
          <div className="flex-[0.5]">
            <div className="m-5 w-[90%] rounded-md bg-white p-3">
              <h1 className="text-xl font-bold">Intro</h1>
              <div className="mt-3">
                <div className="my-4 mx-1 flex items-center space-x-2 ">
                  <FaUniversity size={20} color="gray" />
                  <p className="text-base text-gray-500">
                    Went to Harvard University
                  </p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <MdOutlineMail size={20} color="gray" />
                  <p className="text-base text-gray-500">{user.email}</p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <BiOutline size={20} color="gray" />
                  <p className="text-base text-gray-500">{user.bio}</p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <FaBirthdayCake size={20} color="gray" />
                  <p className="text-base text-gray-500">{user.dob}</p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <GrLocation size={20} color="gray" />
                  <p className="text-base text-gray-500">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>

            <div className="m-5 w-[90%] rounded-md bg-white p-3">
              <h1 className="text-xl font-bold">Friends</h1>
              <div className="mt-3">
                {user?.friends?.map((f) => (
                  <div
                    className="my-4 mx-1 flex items-center space-x-2 "
                    key={f.id}
                  >
                    <img
                      src={f.profilePic}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <p className="text-base text-gray-500">{f.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-[0.5]">
            <div className="m-5 mx-auto w-[90%]">
              {posts?.map((p) => (
                <Post user={user} post={p} key={p.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
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
