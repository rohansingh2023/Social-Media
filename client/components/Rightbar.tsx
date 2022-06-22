import Link from 'next/link'
import React, { useEffect } from 'react'
import { FaBirthdayCake } from 'react-icons/fa'
import { MdOutlineOnlinePrediction } from 'react-icons/md'

const Rightbar = ({ userData }: any) => {
  return (
    // <div className="sticky top-20 h-[100vh] w-1/4">
    <div className=" hidden lg:flex lg:h-full lg:w-1/4 lg:flex-shrink-0 lg:flex-col lg:items-center">
      <div className="h-50 mx-5 my-5 w-11/12 rounded-xl bg-gray-300 bg-pack-train p-3 text-white">
        <p className="ml-3 text-xl font-bold">Tuesday</p>
        <p className="ml-3 text-lg">15 Jan 2022</p>
        <p className="ml-3 text-lg">Mumbai, IN</p>
        <p className="ml-3 mt-10 text-5xl font-extrabold">29 C</p>
        <p className="ml-3 text-lg font-semibold">Sunny</p>
      </div>
      <div className="mx-5 my-5 flex h-20 w-11/12 items-center justify-between rounded-lg bg-gray-300 p-3">
        <FaBirthdayCake size={25} />
        <p className="ml-5 text-lg font-bold">
          Rohan and 2 others have birthday today
        </p>
      </div>
      <div className="mx-10 my-7 h-96 w-11/12 overflow-y-scroll rounded-lg bg-gray-300 p-5">
        {userData?.map((user: any, i: any) => (
          <Link href={`/user/${user.id}`}>
            <div
              className="flex cursor-pointer items-center justify-between p-3"
              key={user.id}
            >
              <div className="flex items-center justify-between">
                <img
                  src={user.profilePic}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded-full"
                />
                <p className="ml-5 text-lg font-semibold">{user.name}</p>
              </div>
              <div>
                <MdOutlineOnlinePrediction size={30} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    // </div>
  )
}

export default Rightbar
