import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineSearch } from 'react-icons/ai'
import Loading from './Loading'
import UserCard from './UserCard'
import { searchUsers } from '../services'
import { useStateContext } from '../context/StateContext'

interface Props {
  userData: User[]
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

  const onlyUserData: User[] = userData?.filter(
    (user: any) => user?.user.id !== id
  )

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <div className="col-span-6 flex max-h-screen flex-1 flex-col overflow-scroll scrollbar-hide lg:border-x ">
      <div className="ml-7 mt-5 flex h-16 w-11/12 items-start justify-center rounded-full bg-white p-5 shadow-lg">
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
        <div className="ml-11 flex w-[88%] flex-col items-center justify-center p-5">
          {onlyUserData?.map((user: any, i: any) => (
            <UserCard key={i} user={user.user} />
          ))}
        </div>
      ) : (
        <div className="ml-11 flex w-[88%] flex-col items-center justify-center p-5">
          {searchResults?.users?.map((user: any, i: any) => (
            <UserCard key={i} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchFriends
