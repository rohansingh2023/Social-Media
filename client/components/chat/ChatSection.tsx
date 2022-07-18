import React, { Dispatch, SetStateAction } from 'react'
import { IoCall } from 'react-icons/io5'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { AiOutlineMore } from 'react-icons/ai'
import { RiSendPlaneFill } from 'react-icons/ri'
import { IoMdPhotos } from 'react-icons/io'

interface IProps {
  isChatOpen: boolean
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
}

const ChatSection = ({ isChatOpen, setIsChatOpen }: IProps) => {
  return (
    <>
      {isChatOpen ? (
        <>
          <div
            className={
              isChatOpen
                ? 'col-span-10 flex max-h-[91vh] flex-col font-Inter transition-all duration-300 ease-in-out md:col-span-5'
                : 'hidden max-h-[91vh] flex-col font-Inter transition-all duration-300 ease-in-out md:col-span-5 md:inline-flex'
            }
          >
            {/* Chat Header */}
            {/* <div className="flex flex-[0.05] items-center justify-between border-x border-b-2 border-gray-300 bg-white px-3 py-1">
              <div className="flex items-center">
                <img
                  src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h1 className="mx-3 text-lg font-semibold">Username</h1>
              </div>

              <div className="flex items-center">
                <IoCall
                  size={40}
                  color="#FF8080"
                  className="mx-1 rounded-full p-2 hover:bg-gray-200 "
                />
                <BsFillCameraVideoFill
                  size={40}
                  color="#FF8080"
                  className="mx-1 rounded-full p-2 hover:bg-gray-200 "
                />
                <AiOutlineMore
                  size={40}
                  color="#FF8080"
                  className="mx-1 rounded-full p-2 hover:bg-gray-200 "
                />
              </div>
            </div> */}

            {/* Chats */}
            <div className="flex-[0.90] overflow-y-scroll border-x bg-white">
              <div className="flex flex-col items-end">
                <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                    alt=""
                    className="h-10 w-10 flex-[0.12] rounded-full object-cover"
                  />
                  <div className="flex-[0.88]">
                    <p className="rounded-r-md rounded-b-md bg-[#FF8080] p-2 text-white">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Fuga voluptatem tempore alias ducimus quod neque sed
                      quaerat dolore. Maxime, minus!
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      2 min ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                    alt=""
                    className="h-10 w-10 flex-[0.12] rounded-full object-cover"
                  />
                  <div className="flex-[0.88]">
                    <p className="rounded-r-md rounded-b-md bg-[#FF8080] p-2 text-white">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Fuga voluptatem tempore alias ducimus quod neque sed
                      quaerat dolore. Maxime, minus!
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      2 min ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                    alt=""
                    className="h-10 w-10 flex-[0.12] rounded-full object-cover"
                  />
                  <div className="flex-[0.88]">
                    <p className="rounded-r-md rounded-b-md bg-gray-200 p-2 text-left">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Fuga voluptatem tempore alias ducimus quod neque sed
                      quaerat dolore. Maxime, minus!
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      2 min ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                    alt=""
                    className="h-10 w-10 flex-[0.12] rounded-full object-cover"
                  />
                  <div className="flex-[0.88]">
                    <p className="rounded-r-md rounded-b-md bg-[#FF8080] p-2 text-white">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Fuga voluptatem tempore alias ducimus quod neque sed
                      quaerat dolore. Maxime, minus!
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      2 min ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                    alt=""
                    className="h-10 w-10 flex-[0.12] rounded-full object-cover"
                  />
                  <div className="flex-[0.88]">
                    <p className="rounded-r-md rounded-b-md bg-gray-200 p-2 text-left">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Fuga voluptatem tempore alias ducimus quod neque sed
                      quaerat dolore. Maxime, minus!
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      2 min ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="float-right flex w-1/2 items-start space-x-2 p-2 text-left">
                  <img
                    src="https://tse3.mm.bing.net/th?id=OIP.zXrPNOOO6yjo5RuG7sKTwAHaLH&pid=Api&P=0&w=120&h=180"
                    alt=""
                    className="h-10 w-10 flex-[0.12] rounded-full object-cover"
                  />
                  <div className="flex-[0.88]">
                    <p className="rounded-r-md rounded-b-md bg-gray-200 p-2 text-left">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Fuga voluptatem tempore alias ducimus quod neque sed
                      quaerat dolore. Maxime, minus!
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      2 min ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Footer */}
            <div className="flex flex-[0.1] items-center justify-between border-gray-300 bg-white">
              <IoMdPhotos size={30} color="#FF8080" className="ml-2" />
              <input
                type="text"
                placeholder="Type your message.."
                className="mx-3 flex-1 rounded-full bg-gray-200 p-2 outline-none"
              />
              <RiSendPlaneFill
                size={40}
                color="#FF8080"
                className="mr-2 rounded-full bg-gray-300 p-2 hover:bg-gray-400"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="hidden max-h-[91vh] items-center justify-center font-Inter md:col-span-5 md:inline-flex">
          <span className="text-3xl font-bold italic ">
            Tap on chat to start messaging
          </span>
        </div>
      )}
    </>
  )
}

export default ChatSection
