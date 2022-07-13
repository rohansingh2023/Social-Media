import { GetServerSideProps, GetStaticProps } from 'next'
import React from 'react'
import { Feed, Leftbar, Navbar, Rightbar } from '../components'
import { getOnlyUsers, getOnlyUsersExMe, getPosts, getUsers } from '../services'
import { authorized } from '../services/auth'

const Index = ({ postData, userData }: any) => {
  return (
    <div className="grid-rows-10 relative  grid max-h-screen overflow-hidden bg-gray-100 font-Segoe">
      <header className="z-50 row-span-1">
        <Navbar />
      </header>
      <div className="row-span-9 grid grid-cols-12">
        <Leftbar />
        <Feed postData={postData} />
        <Rightbar userData={userData} />
      </div>
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { parsedUser } = authorized()
//   const { token } = parsedUser || {}
//   if (!token) {
//     const { res } = context
//     res.writeHead(302, { Location: '/auth/login' })
//     res.end()
//   }

//   return {
//     props: {},
//   }
// }

export const getStaticProps: GetStaticProps = async () => {
  const postData = (await getPosts()) || []
  const userData = (await getOnlyUsers()) || []
  // const onlyUserData = (await getOnlyUsersExMe()) || []
  return {
    props: {
      postData,
      userData,
      // onlyUserData,
    },
  }
}

export default Index
