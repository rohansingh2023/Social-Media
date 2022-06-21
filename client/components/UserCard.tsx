import React from 'react'
import { HiViewList } from 'react-icons/hi'
import { CgPlayListRemove } from 'react-icons/cg'
import { MdOutlineFileDownloadDone } from 'react-icons/md'
import Link from 'next/link'

type Props = {
  user: {
    id: string
    name: string
    email: string
    profilePic: string
    dob: string
    bio: string
  }
}

function UserCard({ user }: Props) {
  return (
    <Link href={`/user/${user.id}`}>
      <div className="mt-10 cursor-pointer rounded-3xl bg-slate-200 p-2 shadow-lg">
        <div className="flex items-center p-2">
          <img
            src={user.profilePic}
            alt=""
            width="50"
            height="50"
            className="rounded-full"
          />
          <div className="ml-3">
            <h2 className="text-xl font-bold text-gray-600">{user.name}</h2>
            <p className="text-md font-semibold text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className=" flex flex-1 items-center justify-evenly">
          <button className="m-2 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl outline-none hover:bg-blue-400">
            <MdOutlineFileDownloadDone color="#fff" size={20} />
            <span className="ml-2 pr-2 text-lg">Add Friend</span>
          </button>
          <button className="m-5 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl hover:bg-blue-400">
            <HiViewList color={'#fff'} size={20} />
            <span className="ml-2 pr-2 text-lg">View Profile</span>
          </button>
          <button className="m-5 flex items-center rounded-full bg-blue-600 p-1 text-white shadow-xl hover:bg-blue-400">
            <CgPlayListRemove color={'#fff'} size={23} />
            <span className="ml-2 pr-2 text-lg">Ignore Card</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default UserCard
