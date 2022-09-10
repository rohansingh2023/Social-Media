import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineSearch } from 'react-icons/ai'
import Loading from './Loading'
import UserCard from './UserCard'
// import { searchUsers } from '../services'
import { useStateContext } from '../context/StateContext'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/activities/userRedux'
import { useQuery } from '@apollo/client'
import { SEARCH_USERS } from '../graphql/queries/userQueries'

interface Props {
  userData: User[]
  searchUsers: any
}

function SearchFriends({ userData, searchUsers }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const currentUser = useSelector(selectCurrentUser)

  const onlyUserData: User[] = searchUsers?.users?.filter(
    (user: any) => user.id !== currentUser?.id
  )

  return (
    <div className="col-span-12 flex max-h-[91vh] flex-1 flex-col overflow-scroll scrollbar-hide lg:col-span-8 lg:border-x xl:col-span-6 ">
      <div className="ml-7 mt-5 flex h-16 w-11/12 items-start justify-center rounded-full p-5 shadow-lg">
        <AiOutlineSearch size={30} />
        <input
          placeholder="Enter friend's name"
          className="ml-3 flex flex-1 bg-slate-200 p-0.5 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="ml-11 flex w-[88%] flex-col items-center justify-center p-5">
        {onlyUserData
          ?.filter((u: { name: string }) =>
            u?.name?.toLowerCase().includes(searchTerm)
          )
          .map((user: any, i: any) => (
            <UserCard key={i} user={user} />
          ))}
      </div>
      {/* )} */}
    </div>
  )
}

export default SearchFriends
