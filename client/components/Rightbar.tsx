import { useQuery } from '@apollo/client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { FaBirthdayCake } from 'react-icons/fa'
import { MdOutlineOnlinePrediction } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useStateContext } from '../context/StateContext'
import { selectCurrentUser } from '../redux/activities/userRedux'

const Rightbar = () => {
  const currentUser = useSelector(selectCurrentUser)

  return (
    // <div className="sticky top-20 h-[100vh] w-1/4">
    <div className="hidden max-h-[91vh] max-w-full overflow-scroll scrollbar-hide lg:col-span-2 lg:inline xl:col-span-3">
      <div className="font-Inter lg:flex lg:h-full lg:flex-shrink-0 lg:flex-col lg:items-center">
        <div className="h-50 mx-5 my-5 w-11/12 rounded-xl border border-b-2 border-gray-300 bg-gray-300 bg-pack-train p-3 text-white">
          <p className="ml-3 text-xl font-bold">Tuesday</p>
          <p className="ml-3 text-lg">15 Jan 2022</p>
          <p className="ml-3 text-lg">Mumbai, IN</p>
          <p className="ml-3 mt-10 text-5xl font-extrabold">29 C</p>
          <p className="ml-3 text-lg font-semibold">Sunny</p>
        </div>
        <div className="mx-5 mt-5 flex h-28 w-11/12 flex-col items-start justify-between border-y border-gray-300 p-3 font-Inter">
          <h1 className="text-lg font-medium text-gray-500">Birthdays</h1>
          <div className="mt-3 flex items-center">
            <FaBirthdayCake size={25} />
            <p className="ml-5 text-base font-normal">
              <span className="font-bold">Rohan and 2 others</span> have
              birthday today
            </p>
          </div>
        </div>
        <div className="flex w-11/12 flex-1 flex-col items-start justify-evenly rounded-lg border-b border-gray-300 p-3 font-Inter">
          <h1 className="text-lg font-medium text-gray-500">Friend Requests</h1>
          <div className="mt-3 max-h-96 w-full overflow-y-scroll">
            {
              currentUser?.friendRequests.length > 0 ? (
                currentUser?.friendRequests?.map((u: friendRequests) => (
                  // user.friends?.map((u) => (
                  <Link href={`/user/${u.userId}`}>
                    <div
                      className="flex cursor-pointer items-center justify-between p-3"
                      key={u.id}
                    >
                      <div className="flex items-center justify-between">
                        <img
                          src={u.profilePic}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <p className="ml-5 text-lg font-semibold">{u.name}</p>
                      </div>
                      <div>
                        <MdOutlineOnlinePrediction size={30} />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <span className=" text-center text-sm font-normal">
                  No Friend Requests to show
                </span>
              )
              // ))
            }
          </div>
        </div>
        <div className="flex w-11/12 flex-1 flex-col items-start justify-evenly rounded-lg border-gray-300 p-3 font-Inter">
          <h1 className="text-lg font-medium text-gray-500">My Friends</h1>
          <div className="mt-3 max-h-96 w-full overflow-y-scroll">
            {currentUser?.friends.length > 0 ? (
              currentUser?.friends?.map(
                (u: friends) => (
                  // user.friends?.map((u) => (
                  <Link href={`/user/${u.userId}`} key={u.id}>
                    <div className="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-200">
                      <div className="flex items-center justify-between">
                        <img
                          src={u.profilePic}
                          alt="profilePic"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <p className="ml-5 text-base font-medium">{u.name}</p>
                      </div>
                      <div>
                        <MdOutlineOnlinePrediction size={30} />
                      </div>
                    </div>
                  </Link>
                )
                // ))
              )
            ) : (
              <span className="text-center text-sm font-normal">
                No Friends to show
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rightbar
