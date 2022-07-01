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
    <div className="sticky col-span-3">
      <div className="hidden lg:flex lg:flex-shrink-0  lg:flex-col lg:items-start lg:justify-around lg:p-6 lg:text-2xl">
        <Link href={`/profile/${id}`} passHref>
          <div className="mb-4 flex w-full items-center justify-start rounded-xl p-3  hover:bg-gray-300">
            <MdAccountCircle size={25} />
            <p className="ml-4 cursor-pointer text-lg font-semibold">
              My Account
            </p>
          </div>
        </Link>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl p-3 hover:bg-gray-300">
          <MdAddShoppingCart size={25} />
          <p className="ml-4 cursor-pointer text-lg font-semibold">
            Shooping Cart
          </p>
        </div>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl p-3 hover:bg-gray-300">
          <MdAnnouncement size={25} />
          <p className="ml-4 cursor-pointer text-lg font-semibold">
            {' '}
            Daily News
          </p>
        </div>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl p-3 hover:bg-gray-300">
          <MdBuild size={25} />
          <p className="ml-4 cursor-pointer text-lg font-semibold">
            Account Settings
          </p>
        </div>
        <Link href={'/search'} passHref>
          <div className="mb-4 flex w-full items-center justify-start rounded-xl p-3 hover:bg-gray-300">
            <MdSearch size={25} />
            <p className="ml-4 cursor-pointer text-lg font-semibold">
              Search Friends
            </p>
          </div>
        </Link>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl p-3 hover:bg-gray-300">
          <MdQuestionAnswer size={25} />
          <p className="ml-4 cursor-pointer  text-xl font-semibold">
            Messenger
          </p>
        </div>
      </div>
    </div>
  )
}

export default Leftbar
