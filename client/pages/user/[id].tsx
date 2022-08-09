import React, { useEffect, useState } from 'react'
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
import Link from 'next/link'
import client from '../../apollo-client'
import { GET_USER_BY_ID } from '../../graphql/queries/userQueries'
import { useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectToken,
} from '../../redux/activities/userRedux'
import toast from 'react-hot-toast'
import { socket } from '../../socket'
import { useMutation } from '@apollo/client'
import { SEND_FRIEND_REQUEST } from '../../graphql/mutations/userMutations'
import { useRouter } from 'next/router'

interface Props {
  userIdData: {
    user: User
    posts: Post[]
  }
}

function UserInfo({ userIdData: { user, posts } }: Props) {
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const [friendInfo, setFriendInfo] = useState<User>()
  const currentUser = useSelector(selectCurrentUser)
  const token = useSelector(selectToken)
  const router = useRouter()
  // const { currentUser } = useStateContext()
  // const { user: cUser, token } = currentUser || {}

  const [friendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    variables: {
      id: user.id,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  })

  useEffect(() => {
    const getUserFriend = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_BY_ID,
          variables: {
            id: user.id,
          },
        })
        setFriendInfo(data?.userById?.user)
      } catch (error) {}
    }
    getUserFriend()
  }, [])

  const isFriend = currentUser?.friends?.findIndex(
    (f) => f.userId.toString() === user.id.toString()
  )

  const isRequestSent = friendInfo?.friendRequests?.findIndex(
    (f) => f.userId.toString() === currentUser?.id.toString()
  )

  const handleRequest = async () => {
    socket.emit('sent_request', {
      cUser: {
        name: currentUser?.name,
        id: currentUser?.id,
        img: currentUser?.profilePic,
      },
      name: user.name,
      id: user.id,
    })

    try {
      const refresh = toast.loading('Sending friend Request...')
      await friendRequest()
      toast.success('Request Sent', {
        id: refresh,
      })
      router.reload()
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  // console.log(isRequestSent)

  return (
    <>
      <Navbar />

      <div className="h-auto bg-gray-200 font-Inter">
        {/* Top */}
        <div className="flex h-auto flex-col bg-white">
          <div className="mx-auto h-[200px] w-full flex-shrink-0 rounded-t-md bg-white opacity-70 lg:h-[400px] lg:w-[75%]">
            <img
              src="https://tse3.mm.bing.net/th?id=OIP.zsEgRepQ6Uh5OYkkhJyn2gHaE5&pid=Api&P=0&w=253&h=167"
              alt=""
              className="mx-auto h-full w-full rounded-b-lg object-cover"
            />
          </div>
          <div className="mx-auto h-64 w-[70%] rounded-b-md lg:h-40">
            <div className="flex flex-col lg:flex-row">
              {/* <div> */}
              <img
                src={user.profilePic}
                alt=""
                className="z-40 mx-auto -mt-20 h-44 w-44 rounded-full object-cover md:ml-10 lg:-mt-10 lg:ml-5"
              />
              {/* </div> */}
              <div className="ml-5 mt-1 flex flex-1 flex-col lg:relative lg:mt-5">
                <h2 className="text-center text-3xl font-bold text-slate-800 lg:text-left">
                  {user.name}
                </h2>
                <div className=" flex flex-1 flex-col items-center lg:flex-row">
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
                  <div className="mt-3 flex items-start justify-between">
                    <button
                      onClick={handleRequest}
                      disabled={isFriend !== -1 || isRequestSent !== -1}
                      className={
                        isFriend !== -1
                          ? 'flex h-10 items-center rounded-md bg-gray-300 p-3 text-center font-semibold outline-none hover:bg-gray-400 lg:absolute lg:right-7 lg:bottom-0 lg:justify-center'
                          : isRequestSent !== -1
                          ? 'flex h-10 items-center rounded-md bg-green-500 p-3 text-center font-semibold text-white outline-none hover:bg-orange-400 lg:absolute lg:right-7 lg:bottom-0 lg:justify-center'
                          : 'flex h-10 items-center rounded-md bg-[#FF8080] p-3 text-center font-semibold text-white outline-none hover:bg-orange-400 lg:absolute lg:right-7 lg:bottom-0 lg:justify-center'
                      }
                    >
                      {isFriend !== -1 ? (
                        <TiTick />
                      ) : isRequestSent !== -1 ? (
                        <TiTick />
                      ) : (
                        <RiAddLine />
                      )}

                      {isFriend !== -1
                        ? 'Friends'
                        : isRequestSent !== -1
                        ? 'Request Sent'
                        : 'Add Friend'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mx-auto flex max-w-5xl flex-col lg:flex-row">
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
                  <Link href={`/user/${f.userId}`}>
                    <div
                      className="my-4 mx-1 flex cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200"
                      key={f.id}
                    >
                      <img
                        src={f.profilePic}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <p className="text-base text-gray-500">{f.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative flex-[0.5]">
            {posts.length > 0 ? (
              <div className="m-5 mx-auto w-[90%]">
                {posts?.map((p) => (
                  <Post user={user} post={p} key={p.id} />
                ))}
              </div>
            ) : (
              <div className="absolute top-56 left-44">
                <span className="text-xl font-bold italic">
                  No Post to show
                </span>
              </div>
            )}
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
