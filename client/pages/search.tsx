import React, { useEffect } from 'react'
import { Navbar } from '../components'
import {
  getOnlyUsers,
  getOnlyUsersExMe,
  getSearchUsers,
  getUsers,
} from '../services'
import dynamic from 'next/dynamic'
import Loading from '../components/Loading'
import { useCurrentState } from '../state-management/zustand'

const SearchFriends = dynamic(() => import('../components/SearchFriends'), {
  loading: () => <Loading />,
})

const Leftbar = dynamic(() => import('../components/Leftbar'), {
  // ssr: false,
  loading: () => <Loading />,
})
const Rightbar = dynamic(() => import('../components/Rightbar'), {
  // ssr: false,
  loading: () => <Loading />,
})

interface Props {
  userData: User[]
  onlyUserData: User[]
  searchUsers: any
}

const Search = ({ searchUsers }: Props) => {
  const addCurrentUser = useCurrentState((state) => state.addCurrentUser)

  useEffect(() => {
    addCurrentUser()
  }, [])
  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden font-DMSerif">
      <header className="z-50 row-span-1">
        <Navbar />
      </header>
      <div className="row-span-9 grid grid-cols-12">
        <Leftbar />
        <SearchFriends searchUsers={searchUsers} />
        <Rightbar />
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const searchUsers = (await getSearchUsers('')) || []

  return {
    props: {
      searchUsers,
    },
  }
}

export default Search
