import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineSearch } from 'react-icons/ai'
import Loading from './Loading'
import UserCard from './UserCard'
import { searchUsers } from '../services'
import { useStateContext } from '../context/StateContext'

type Props = {
  userData: any
}

function SearchFriends({ userData }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any>({
    users: [],
    totalCount: 0,
  })
  const { currentUser } = useStateContext()
  const { user } = currentUser || {}
  const { id } = user || {}

  const onlyUserData = userData?.filter((user: any) => user?.user.id !== id)

  const handleEnter = async (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      try {
        const data = (await searchUsers(searchTerm)) || []
        setSearchResults({
          users: data.users,
          totalCount: data.totalCount,
        })
        toast.success(`Found ${data?.users.length} users`)
      } catch (error) {
        toast.error(`${error}`)
        console.log(error)
      }
    }
  }

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleEnter}
        />
      </div>
      {searchResults.totalCount <= 0 ? (
        <div className="flex w-[88%] flex-col items-center p-5">
          {onlyUserData?.map((user: any, i: any) => (
            <UserCard key={i} user={user.user} />
          ))}
        </div>
      ) : (
        <div className="flex w-[88%] flex-col items-center p-5">
          {searchResults?.users?.map((user: any, i: any) => (
            <UserCard key={i} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchFriends
