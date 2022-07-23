import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { IoCall } from 'react-icons/io5'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { AiOutlineMore } from 'react-icons/ai'
import { RiSendPlaneFill } from 'react-icons/ri'
import { IoMdPhotos } from 'react-icons/io'
import axios from 'axios'
import { useStateContext } from '../../context/StateContext'
import MessageCard from './MessageCard'
import Loading from '../Loading'
import { socket } from '../../socket'

interface IProps {
  isChatOpen: boolean
  setIsChatOpen: Dispatch<SetStateAction<boolean>>
  currentChat: Conversation | undefined
  setCurrentChat: Dispatch<any>
}

const ChatSection = ({ isChatOpen, setIsChatOpen, currentChat }: IProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [msgInput, setMsgInput] = useState<string>('')
  const [arrivalMessage, setArrivalMessage] = useState<{
    sender: any
    text: any
    createdAt: number
  }>({
    sender: '',
    text: '',
    createdAt: 0,
  })
  const { currentUser } = useStateContext()
  const scrollRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    socket.on('getMessage', (data) => {
      setMessages((prev) => [...prev, data])
    })
  }, [socket])

  useEffect(() => {
    socket.emit('addUser', currentUser?.user?.id)
  }, [currentUser?.user?.id, socket])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/message/${currentChat?._id}`
        )
        setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getMessages()
  }, [currentChat])

  const receiverId = currentChat?.members.find(
    (m) => m !== currentUser?.user?.id
  )

  const handleMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation
      try {
        const message = {
          conversationId: currentChat?._id,
          sender: currentUser?.user?.id,
          text: msgInput,
        }

        const receiverId = currentChat?.members.find(
          (m) => m !== currentUser?.user?.id
        )

        await socket.emit('sendMessage', {
          conversationId: currentChat?._id,
          sender: currentUser?.user?.id,
          receiverId,
          text: msgInput,
          createdAt: Date.now(),
        })

        const res = await axios.post(
          'http://localhost:3001/api/message/',
          message
        )
        setMessages([...messages, res.data])
        setMsgInput('')
      } catch (error) {}
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages) {
    return <Loading />
  }

  const socketTest = () => {
    socket.emit('test', { message: 'Hello' })
  }

  return (
    <>
      {isChatOpen ? (
        <>
          <div
            className={
              isChatOpen
                ? 'col-span-12 flex max-h-[91vh] flex-col font-Inter transition-all duration-300 ease-in-out md:col-span-6'
                : 'hidden max-h-[91vh] flex-col font-Inter transition-all duration-300 ease-in-out md:col-span-6 md:inline-flex'
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
              {messages?.map((m) => (
                <div ref={scrollRef}>
                  <MessageCard
                    key={m._id}
                    message={m}
                    receiverId={receiverId}
                  />
                </div>
              ))}
            </div>

            {/* Chat Footer */}
            <div className="flex flex-[0.1] items-center justify-between border-gray-300 bg-white">
              <IoMdPhotos size={30} color="#FF8080" className="ml-2" />
              <input
                type="text"
                placeholder="Type your message.."
                className="mx-3 flex-1 rounded-full bg-gray-200 p-2 outline-none"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyPress={handleMessage}
              />
              <RiSendPlaneFill
                size={40}
                color="#FF8080"
                onClick={socketTest}
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
