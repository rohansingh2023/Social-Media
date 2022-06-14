import React from 'react'

const Sidebar = () => {
  return (
    <div className="fixed right-0 top-0 z-50 bg-black">
      {/* <div className="relative float-right mt-5 ml-3 flex h-96 w-96 flex-col items-start justify-between divide-y text-2xl font-bold italic">
        <p className=" text-black">Username</p>
        <p className=" text-black">Home</p>
        <p className=" text-black">Search Friends</p>
        <p className=" text-black">My Profile</p>
      </div> */}
      <div className="mt-10 grid h-screen w-96  grid-cols-1 divide-y divide-white text-2xl font-bold italic text-white transition delay-150 ease-in-out">
        <p className="ml-3">Username</p>
        <p className=" ml-3">Home</p>
        <p className=" ml-3">Search Friends</p>
        <p className=" ml-3">My Profile</p>
      </div>
    </div>
  )
}

export default Sidebar
