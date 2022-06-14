import React, { useState } from 'react'
import { FaHome, FaSearch, FaFortAwesomeAlt, FaListUl } from 'react-icons/fa'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { MdArrowDropDown } from 'react-icons/md'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdown, setDropdown] = useState<boolean>(true)
  const { currentUser } = useStateContext()
  const { user } = currentUser
  const { id } = user || {}
  console.log(id)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    toast.info('Logged out successfully')
    router.push('/auth/login')
    window.location.reload()
  }

  const Dropdown = () => {
    return (
      <div className="relative top-8 right-20 z-50 rounded-lg bg-white p-3 text-black">
        <p className="border border-b-black">View Profile</p>
        <p className="border border-b-black">Check Info</p>
        <p className="border border-b-black">Logout</p>
      </div>
    )
  }

  return (
    <>
      <div className=" fixed top-0 z-40 flex w-screen items-center justify-between bg-purple-600 py-5 px-10 text-white">
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
        <div className="hidden lg:flex lg:items-center lg:justify-items-stretch">
          <Link href={'/'} passHref>
            <FaHome className="mr-20" size={35} />
          </Link>
          <Link href={'/search'} passHref>
            <FaSearch className="mr-20" size={30} />
          </Link>
          <Link href={`/profile/${id}`} passHref>
            <FaFortAwesomeAlt className="mr-20" size={35} />
          </Link>
        </div>
        <div className="flex">
          <div className="mr-10 flex items-center justify-between">
            <div className="flex items-center">
              {/* <p className="hidden  lg:flex lg:text-xl">{user?.name}</p>
              <MdArrowDropDown size={30} className="mr-5" /> */}
              <select className="mr-5 bg-inherit text-xl font-semibold outline-none">
                <option value="" selected disabled hidden className="">
                  {user?.name}
                </option>
                <option value="" className="text-lg text-black">
                  View Profile
                </option>
                <option value="" className="text-lg text-black">
                  Check Info
                </option>
                <option
                  value=""
                  className="text-lg text-black"
                  onClick={handleLogout}
                >
                  Logout
                </option>
              </select>
            </div>
            <div className="flex items-center">
              <img
                src={user?.profilePic}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              {/* <RiLogoutBoxLine
                className="ml-8"
                size={30}
                onClick={handleLogout}
              /> */}
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
