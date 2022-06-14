import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Loading from './Loading'
import UserCard from './UserCard'

type Props = {
  userData: any
}

function SearchFriends({ userData }: Props) {
  if (!userData) {
    return <Loading />
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-5 flex h-16 w-11/12 items-start justify-center rounded-full bg-white p-5 shadow-lg">
        <AiOutlineSearch size={30} />
        <input
          placeholder="Enter friend's name"
          className="ml-3 flex flex-1 p-0.5 outline-none"
        />
      </div>
      <div className="flex w-[88%] flex-col items-center p-5">
        {userData?.map((user: any, i: any) => (
          <UserCard key={i} user={user.user} post={user.posts} />
        ))}
      </div>
    </div>
  )
}

export default SearchFriends
