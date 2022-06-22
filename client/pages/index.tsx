import React from 'react'
import { Feed, Leftbar, Navbar, Rightbar } from '../components'
import { getOnlyUsers, getOnlyUsersExMe, getPosts, getUsers } from '../services'

const Index = ({ postData, userData }: any) => {
  console.log(postData)

  return (
    <div className="flex font-PtSans">
      <header className="z-50">
        <Navbar />
      </header>
      <Leftbar />
      <Feed postData={postData} />
      <Rightbar userData={userData} />
    </div>
  )
}

export async function getStaticProps() {
  const postData = (await getPosts()) || []
  const userData = (await getOnlyUsers()) || []
  return {
    props: {
      postData,
      userData,
    },
  }
}

export default Index
