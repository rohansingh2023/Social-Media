import React from 'react'

const Sidebar = () => {
  return (
    <div className="fixed right-0 top-0 z-50 bg-black">
      <div className="mt-10 grid h-screen w-96  grid-rows-4 divide-y divide-white text-2xl font-bold italic text-white transition-all duration-200 ease-out">
        <p className="row-span-1 ml-3">Home</p>
        <p className=" row-span-1 ml-3">Search</p>
        <p className=" row-span-1 ml-3">Profile</p>
        <p className=" row-span-1 ml-3">Logout</p>
      </div>
    </div>
  )
}

export default Sidebar
