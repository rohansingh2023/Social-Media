import Head from 'next/head'
import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }: any) => {
  return (
    <div>
      <Head>
        <title>Social Media</title>
      </Head>

      <main className="relative top-20 z-0">{children}</main>
    </div>
  )
}

export default Layout
