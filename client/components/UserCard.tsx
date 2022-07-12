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

interface Props {
  user: User
}

function UserCard({ user }: Props) {
  const router = useRouter()
  const [isFriend, setIsFriend] = useState<boolean>(false)

  const { currentUser } = useStateContext()
  const { user: u, token } = currentUser || {}

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
    u?.friends.forEach((f: any) =>
      f.email === user.email ? setIsFriend(true) : setIsFriend(false)
    )
  }, [u])

  const myFriend: User[] = u?.friends.filter(
    (fr: { email: string }) => fr.email === user.email
  )
  console.log(myFriend)
  console.log(u)

  // const fUsers = u?.friends.filter((f: any) => f.email === user.email)

  // console.log(fUsers)
  // console.log(u?.friends)
  // console.log(user.email)
  console.log(isFriend)

  const handleRequest = async () => {
    try {
      const refresh = toast.loading('Sending friend Request...')
      await friendRequest()
      toast.success('Request Sent', {
        id: refresh,
      })
    } catch (error) {
      toast.error(`${error}`)
      console.log(error)
    }
  }

  return (
    // <Link href={`/user/${user.id}`}>
    <div className="mt-10 flex flex-1 cursor-pointer flex-col rounded-3xl bg-slate-200 p-2 shadow-lg">
      <div className="flex items-center p-2">
        <img
          src={user.profilePic}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="text-xl font-bold text-gray-600">{user.name}</h2>
          <p className="text-md font-semibold text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className=" flex flex-1 items-center justify-evenly">
        <button
          disabled={isFriend}
          className={
            !isFriend
              ? 'm-2 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl outline-none hover:bg-blue-400'
              : 'm-2 flex items-center rounded-full bg-gray-300 p-1 text-black shadow-xl outline-none '
          }
          onClick={handleRequest}
        >
          <MdOutlineFileDownloadDone
            color={isFriend ? '#111' : '#fff'}
            size={20}
          />
          <span className="ml-2 pr-2 text-lg">
            {isFriend ? 'Already Friends' : 'Add Friend'}
          </span>
        </button>
        <button
          className="m-5 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl hover:bg-blue-400"
          onClick={() => router.push('/')}
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
