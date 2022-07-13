import React, { useState } from 'react'
import { FaHome, FaSearch, FaFortAwesomeAlt, FaListUl } from 'react-icons/fa'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { MdArrowDropDown } from 'react-icons/md'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { IoIosPersonAdd } from 'react-icons/io'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser } = useStateContext()
  const { user } = currentUser
  const { id } = user || {}
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    toast.info('Logged out successfully')
    router.replace('/auth/login')
  }

  return (
    <>
      <div className=" fixed left-0 top-0 z-50 flex w-screen items-center justify-between bg-[#FF8080] py-4 px-10 font-DMSerif text-white">
        <div className="flex items-center justify-around ">
          <Link href={'/'} passHref>
            <p className="cursor-pointer text-3xl font-bold italic">
              Social Media
            </p>
          </Link>
          <input
            placeholder="Search Posts"
            className="lg:w-200 hidden lg:ml-5 lg:flex lg:rounded-3xl lg:border-0 lg:bg-white  lg:p-2 lg:text-black lg:outline-none"
          />
        </div>
        <div className="hidden md:justify-center lg:flex lg:items-center lg:justify-items-stretch">
          <Link href={'/'} passHref>
            <FaHome className="mr-20" size={35} />
          </Link>
          <Link href={'/search'} passHref>
            <FaSearch className="mr-20" size={30} />
          </Link>
          <Link href={'/friendRequest'} passHref>
            <IoIosPersonAdd className="mr-20" size={35} />
          </Link>
          <Link href={`/profile/${id}`} passHref>
            <FaFortAwesomeAlt className="mr-20" size={35} />
          </Link>
        </div>
        <div className="flex">
          <div className="mr-10 flex items-center justify-between">
            <div className="flex items-center">
              <p className="hidden lg:flex lg:text-xl">{user?.name}</p>
              <MdArrowDropDown
                size={30}
                className="invisible lg:visible lg:mr-5"
              />
            </div>
            <div className="flex items-center">
              <img
                src={user?.profilePic}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <RiLogoutBoxLine
                className="invisible lg:visible lg:ml-8"
                size={30}
                onClick={handleLogout}
              />
              {/* <p>xkcnsknca</p> */}
            </div>
            <FaListUl
              size={25}
              className="lg:hidden"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
        {isOpen && <Sidebar />}
      </div>
    </>
  )
}

export default Navbar
