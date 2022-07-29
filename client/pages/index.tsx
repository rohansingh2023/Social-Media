import { GetServerSideProps, GetStaticProps } from 'next'
import React from 'react'
import { useSelector } from 'react-redux'
import { Feed, Leftbar, Navbar, Rightbar } from '../components'
import { selectCurrentUser, selectToken } from '../redux/activities/userRedux'
import { getOnlyUsers, getOnlyUsersExMe, getPosts, getUsers } from '../services'
import { authorized } from '../services/auth'
import { socket } from '../socket'

const Index = ({ postData, userData }: any) => {
  socket.on('friend_request', (data) => {
    console.log(data)
  })

  const token = useSelector(selectToken)
  console.log(token)

  return (
    <div className="relative bg-slate-50 font-Segoe">
      <header className="z-50 ">
        <Navbar />
      </header>
      <div className="grid grid-cols-12">
        <Leftbar />
        <Feed postData={postData} />
        <Rightbar />
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
