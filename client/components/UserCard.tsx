import React, { useEffect, useState } from 'react'
import { HiViewList } from 'react-icons/hi'
import { CgPlayListRemove } from 'react-icons/cg'
import { MdOutlineFileDownloadDone } from 'react-icons/md'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { type } from 'os'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { SEND_FRIEND_REQUEST } from '../graphql/mutations/userMutations'
import toast from 'react-hot-toast'
import client from '../apollo-client'
import { GET_USER_BY_ID } from '../graphql/queries/userQueries'
import { getUserById, getUsers } from '../services'
import { socket } from '../socket'

interface Props {
  user: User
}

function UserCard({ user }: Props) {
  const router = useRouter()
  const [userD, setUserD] = useState<User>(user)
  const [isFriend, setIsFriend] = useState<boolean>(false)
  const [friends, setFriends] = useState<User>()
  const [friendInfo, setFriendInfo] = useState<User>()

  const { currentUser } = useStateContext()
  const { user: u, token } = currentUser || {}
  const { id } = u || {}

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
            id: id,
          },
        })
        setFriends(data?.userById?.user)
      } catch (error) {}
    }
    getUserFriend()
  }, [])

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

  const myFriend = friends?.friends?.findIndex(
    (f) => f.userId.toString() === user.id.toString()
  )

  const isRequestSent = friendInfo?.friendRequests?.findIndex(
    (f) => f.userId.toString() === id.toString()
  )
  // const myFriend = friends?.friends?.every((f: friends) => f.userId === user.id)

  console.log(isRequestSent)
  // console.log(myFriend)
  // console.log(isRequestSent)

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing...')
    const u: User = await getUserById(user.id)
    setUserD(u)
    toast.success('Search Section Updated', {
      id: refreshToast,
    })
  }

  const handleRequest = async () => {
    socket.emit('sent_request', {
      cUser: {
        name: u?.name,
        id: u?.id,
        img: u?.profilePic,
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

  return (
    // <Link href={`/user/${user.id}`}>
    <div className="mt-10 flex flex-1 cursor-pointer flex-col rounded-md bg-white p-2 font-Inter shadow-lg">
      <div className="flex items-center p-2">
        <img
          src={user.profilePic}
          alt=""
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="text-xl font-bold text-gray-600">{user.name}</h2>
          <p className="text-md font-semibold text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className=" flex flex-1 items-center justify-evenly">
        <button
          disabled={myFriend !== -1 || isRequestSent !== -1}
          className={
            myFriend !== -1
              ? 'm-2 flex items-center rounded-full bg-gray-300 p-1 text-black shadow-xl outline-none '
              : isRequestSent !== -1
              ? 'm-2 flex items-center rounded-full bg-green-600 p-1 text-white shadow-xl outline-none hover:bg-green-400'
              : 'm-2 flex items-center rounded-full bg-[#FF8080] p-1 text-white shadow-xl outline-none hover:bg-orange-400'
          }
          onClick={handleRequest}
        >
          <MdOutlineFileDownloadDone
            color={isFriend ? '#111' : '#fff'}
            size={20}
          />
          <span className="ml-2 pr-2 text-lg">
            {myFriend !== -1
              ? 'Already Friends'
              : isRequestSent !== -1
              ? 'Request Sent'
              : 'Add Friend'}
          </span>
        </button>
        <button
          className="m-5 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl hover:bg-blue-400"
          onClick={() => router.push(`/user/${user.id}`)}
        >
          <HiViewList color={'#fff'} size={20} />
          <span className="ml-2 pr-2 text-lg">View Profile</span>
        </button>
        <button className="m-5 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl hover:bg-blue-400">
          <CgPlayListRemove color={'#fff'} size={23} />
          <span className="ml-2 pr-2 text-lg">Ignore Card</span>
        </button>
      </div>
    </div>
    // </Link>
  )
}

export default UserCard
