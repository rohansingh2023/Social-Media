import Link from 'next/link'
import React from 'react'
import {
  MdAddShoppingCart,
  MdAnnouncement,
  MdBuild,
  MdQuestionAnswer,
  MdSearch,
} from 'react-icons/md'
import Image from 'next/image'
import { useCurrentState } from '../state-management/zustand'

const Leftbar = () => {
  const currentUser = useCurrentState((state) => state.currentUser)

  return (
    <div className="sticky max-h-[91vh] flex-1 bg-gray-100 lg:col-span-2 xl:col-span-3">
      <div className="hidden font-Inter lg:inline-flex lg:flex-1 lg:flex-col lg:items-start lg:justify-around lg:p-3 lg:text-lg">
        <Link href={`/profile/${currentUser?.user?._id}`} passHref>
          <div className="mb-4 flex flex-1 items-center justify-start rounded-xl py-2  px-1 hover:bg-gray-200">
            {/* <MdAccountCircle size={35} /> */}
            {currentUser?.user?.profilePic && (
              <Image
                src={currentUser?.user?.profilePic}
                alt=""
                height={48}
                width={48}
                className="rounded-full object-cover"
              />
            )}
            <p className="ml-4 cursor-pointer text-sm font-semibold">
              {currentUser?.user?.name}
            </p>
          </div>
        </Link>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdAddShoppingCart size={35} />
          <p className="ml-4 cursor-pointer text-sm font-medium">
            Shooping Cart
          </p>
        </div>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdAnnouncement size={35} />
          <p className="ml-4 cursor-pointer text-sm font-medium"> Daily News</p>
        </div>
        <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
          <MdBuild size={35} />
          <p className="ml-4 cursor-pointer text-sm font-medium">
            Account Settings
          </p>
        </div>
        <Link href={'/search'} passHref>
          <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
            <MdSearch size={35} />
            <p className="ml-4 cursor-pointer text-sm font-medium">
              Search Friends
            </p>
          </div>
        </Link>
        <Link href={`/chat/${currentUser?.user?._id}`}>
          <div className="mb-4 flex w-full items-center justify-start rounded-xl py-2 px-1 hover:bg-gray-200">
            <MdQuestionAnswer size={35} />
            <p className="ml-4 cursor-pointer text-sm font-medium">Messenger</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Leftbar
