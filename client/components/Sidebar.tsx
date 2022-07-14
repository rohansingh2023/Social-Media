import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { ImCross } from 'react-icons/im'
import { useStateContext } from '../context/StateContext'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser } = useStateContext()
  const { user } = currentUser
  const { id } = user || {}

  return (
    <div className="fixed right-0 top-0 z-50 bg-slate-200 text-black">
      <div className="flex h-screen w-96 flex-col items-end justify-end transition-all duration-200 ease-in-out">
        <ImCross
          color="#FF8080"
          size={30}
          className="mx-2 my-4"
          onClick={() => setIsOpen(false)}
        />
        <div className="flex h-full w-full flex-col items-start justify-start">
          <Link href={'/'}>
            <div className="m-4 w-full cursor-pointer rounded-md p-2 text-base uppercase transition-all duration-200 ease-in-out hover:bg-gray-500  hover:text-white ">
              <p className="ml-3 text-2xl">Home</p>
            </div>
          </Link>
          <Link href={'/search'}>
            <div className="m-4 w-full cursor-pointer rounded-md p-2 text-base uppercase transition-all duration-200 ease-in-out hover:bg-gray-500  hover:text-white ">
              <p className="ml-3 text-2xl">Search</p>
            </div>
          </Link>
          <Link href={'/friendRequest'}>
            <div className="m-4 w-full cursor-pointer rounded-md p-2 text-base uppercase transition-all duration-200 ease-in-out hover:bg-gray-500  hover:text-white ">
              <p className="ml-3 text-2xl">FriendRequests</p>
            </div>
          </Link>
          <Link href={`/profile/${id}`}>
            <div className="m-4 w-full cursor-pointer rounded-md p-2 text-base uppercase transition-all duration-200 ease-in-out hover:bg-gray-500  hover:text-white ">
              <p className="ml-3 text-2xl">Profile</p>
            </div>
          </Link>
          <Link href={'/'}>
            <div className="m-4 w-full cursor-pointer rounded-md p-2 text-base uppercase transition-all duration-200 ease-in-out hover:bg-gray-500  hover:text-white ">
              <p className="ml-3 text-2xl">Logout</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
