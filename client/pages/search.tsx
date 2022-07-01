import React from 'react'
import { Leftbar, Navbar, Rightbar, SearchFriends } from '../components'
import { getOnlyUsers, getOnlyUsersExMe, getUsers } from '../services'

const Search = ({ userData, onlyUserData }: any) => {
  console.log(userData)

  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden font-PtSans">
      <header className="z-50 row-span-1">
        <Navbar />
      </header>
      <div className="row-span-9 grid grid-cols-12">
        <Leftbar />
        <SearchFriends userData={userData} />
        <Rightbar userData={onlyUserData} />
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const userData = (await getUsers()) || []
  const onlyUserData = (await getOnlyUsers()) || []

  return {
    props: {
      userData,
      onlyUserData,
    },
  }
}

export default Search
