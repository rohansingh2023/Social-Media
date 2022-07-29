import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Layout = ({ children }: any) => {
  const router = useRouter()

  useEffect(() => {
    const checkIsAuthUser = () => {
      const user = localStorage.getItem('authUser')
      if (user) {
        const parsedUser = JSON.parse(user)
        // router.replace('/')
      } else {
        router.replace('/auth/login')
      }
      // !user && router.replace('/auth/login')
    }
    checkIsAuthUser()
  }, [])

  return (
    <div>
      <Head>
        <title>Social Media</title>
      </Head>

      <main className="relative top-16 z-0 h-[91vh] bg-gray-200">
        {children}
      </main>
    </div>
  )
}

export default Layout
