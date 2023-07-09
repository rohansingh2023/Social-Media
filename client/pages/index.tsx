import { GetServerSideProps, GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { Navbar } from '../components'
import { getOnlyUsers, getOnlyUsersExMe, getPosts, getUsers } from '../services'
import { socket } from '../socket'
import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'
import { CURRENT_USER, HELLO } from '../graphql/queries/userQueries'
import { useCurrentState } from '../state-management/zustand'
import { addCurrentUser } from '../redux/activities/userRedux'
import client from '../apollo-client'
import request, { GraphQLClient } from 'graphql-request'
import Loading from '../components/Loading'

const DynamicFeedComponent = dynamic(() => import('../components/Feed'), {
  // ssr: false,
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
  postData: Post[]
  userData: User[]
  token: any
}

const Index = ({ postData }: Props) => {
  socket.on('friend_request', (data) => {
    console.log(data)
  })
  const addCurrentUser = useCurrentState((state) => state.addCurrentUser)
  // const currentUser = useCurrentState((state)=> state.currentUser);

  useEffect(() => {
    addCurrentUser()
  }, [])
  // const token = localStorage.getItem('userToken')

  // const getData = async () => {
  //   console.log(token)

  //   try {
  //     const authClient = new GraphQLClient('http://localhost:8080/graphql', {
  //       headers: {
  //         authorization: `Bearer ${token}`,
  //       },
  //     })

  //     const res = await authClient.request(HELLO)
  //     console.log(res)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // getData()

  return (
    <div className="relative bg-slate-50 font-Segoe">
      <header className="z-50 ">
        <Navbar />
      </header>
      <div className="grid grid-cols-12">
        <Leftbar />
        <DynamicFeedComponent postData={postData} />
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

// export const getStaticProps: GetStaticProps = async () => {
//   const postData = (await getPosts()) || []
//   const userData = (await getOnlyUsers()) || []
//   // const onlyUserData = (await getOnlyUsersExMe()) || []
//   return {
//     props: {
//       postData,
//       userData,
//       // onlyUserData,
//     },
//   }
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.userJwt
  // console.log(token)

  // const authClient = new GraphQLClient('http://localhost:8000/graphql', {
  //   headers: {
  //     token: `Bearer ${token}`,
  //   },
  // })

  // const res = await authClient.request(HELLO)
  // console.log(res)
  const postData = (await getPosts()) || []
  // const userData = (await getOnlyUsers()) || []
  // const onlyUserData = (await getOnlyUsersExMe()) || []
  return {
    props: {
      postData,
      // userData,
      // token,
      // onlyUserData,
    },
  }
}

export default Index
