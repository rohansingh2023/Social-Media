import React from 'react'
import { Leftbar, Navbar, Rightbar, SearchFriends } from '../components'
import { getOnlyUsers, getOnlyUsersExMe, getUsers } from '../services'

const Search = ({ userData, onlyUserData }: any) => {
  console.log(userData)

  return (
    <>
      <header className="z-50">
        <Navbar />
      </header>
      <div className="flex">
        <Leftbar />
        <SearchFriends userData={userData} />
        <Rightbar userData={onlyUserData} />
      </div>
    </>
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
