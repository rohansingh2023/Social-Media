import Link from 'next/link'
import React from 'react'
import {
  MdAddShoppingCart,
  MdAccountCircle,
  MdAnnouncement,
  MdBuild,
  MdQuestionAnswer,
  MdSearch,
} from 'react-icons/md'
import { useStateContext } from '../context/StateContext'

const Leftbar = () => {
  const { currentUser } = useStateContext()
  const { user } = currentUser
  const { id } = user || {}

  return (
    <div className="sticky flex-1 bg-gray-100 lg:col-span-2 xl:col-span-3">
      <div className="hidden font-Inter lg:inline-flex lg:flex-1 lg:flex-col lg:items-start lg:justify-around lg:p-3 lg:text-lg">
        <Link href={`/profile/${id}`} passHref>
          <div className="mb-4 flex flex-1 items-center justify-start rounded-xl py-2  px-1 hover:bg-gray-200">
            {/* <MdAccountCircle size={35} /> */}
            <img
              src={user?.profilePic}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <p className="ml-4 cursor-pointer text-base font-semibold">
              {user?.name}
            </p>
          </div>
        </Link>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdAddShoppingCart size={35} />
          <p className="ml-4 cursor-pointer text-base font-semibold">
            Shooping Cart
          </p>
        </div>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdAnnouncement size={35} />
          <p className="ml-4 cursor-pointer text-base font-semibold">
            {' '}
            Daily News
          </p>
        </div>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdBuild size={35} />
          <p className="ml-4 cursor-pointer text-base font-semibold">
            Account Settings
          </p>
        </div>
        <Link href={'/search'} passHref>
          <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
            <MdSearch size={35} />
            <p className="ml-4 cursor-pointer text-base font-semibold">
              Search Friends
            </p>
          </div>
        </Link>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdQuestionAnswer size={35} />
          <p className="ml-4 cursor-pointer text-base  font-semibold">
            Messenger
          </p>
        </div>
      </div>
    </div>
  )
}

export default Leftbar
