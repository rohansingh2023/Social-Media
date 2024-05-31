import React, { useEffect, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoMdPhotos } from "react-icons/io";
import axios from "axios";
import { socket } from "../../utils/web-socket";
import { useCurrentState } from "../../state-management/current-user";
import MessageCard from "./MessageCard";

//   const MessageCard = dynamic(() => import('./MessageCard'), {
//     loading: () => <p>Loading</p>,
//   })

interface IProps {
  isChatOpen: boolean;
  // setIsChatOpen: Dispatch<SetStateAction<boolean>>
  currentChat: Conversation | undefined;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
}

const ChatSection = ({ isChatOpen, currentChat }: IProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState<string>("");
  // const [arrivalMessage, setArrivalMessage] = useState<{
  //   sender: any
  //   text: any
  //   createdAt: number
  // }>({
  //   sender: '',
  //   text: '',
  //   createdAt: 0,
  // })
  const currentUser = useCurrentState((state) => state.currentUser);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {
    socket.emit("addUser", currentUser?.user?._id);
  }, [currentUser?.user?._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/message/${currentChat?._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const receiverId = currentChat?.members.find(
    (m) => m !== currentUser?.user?._id
  );

  const handleMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation;
      try {
        const message = {
          conversationId: currentChat?._id,
          sender: currentUser?.user?._id,
          text: msgInput,
        };

        const receiverId = currentChat?.members.find(
          (m) => m !== currentUser?.user?._id
        );

        await socket.emit("sendMessage", {
          conversationId: currentChat?._id,
          sender: currentUser?.user?._id,
          receiverId,
          text: msgInput,
          createdAt: Date.now(),
        });

        const res = await axios.post(
          "http://localhost:3001/api/message/",
          message
        );
        setMessages([...messages, res.data]);
        setMsgInput("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages) {
    return "Loading";
  }

  const socketTest = () => {
    socket.emit("test", { message: "Hello" });
  };

  return (
    <>
      {isChatOpen ? (
        <>
          <div
            className={
              isChatOpen
                ? "col-span-12 flex max-h-[91vh] flex-col font-Inter transition-all duration-300 ease-in-out md:col-span-6"
                : "hidden max-h-[91vh] flex-col font-Inter transition-all duration-300 ease-in-out md:col-span-6 md:inline-flex"
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
            <div className="flex-[0.90] overflow-y-scroll border-x bg-[#010100] text-white">
              {messages?.map((m) => (
                <div ref={scrollRef} key={m._id}>
                  <MessageCard message={m} receiverId={receiverId} />
                </div>
              ))}
            </div>

            {/* Chat Footer */}
            <div className="flex flex-[0.1] items-center justify-between border-gray-300 bg-[#191818] text-white">
              <IoMdPhotos size={30} color="#FF8080" className="ml-2" />
              <input
                type="text"
                placeholder="Type your message.."
                className="mx-3 flex-1 rounded-full bg-[#010100] p-2 outline-none"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyPress={handleMessage}
              />
              <RiSendPlaneFill
                size={40}
                color="#FF8080"
                onClick={socketTest}
                className="mr-2 rounded-full bg-[#010100] p-2 hover:bg-gray-400"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="hidden max-h-[91vh] items-center justify-center font-Inter md:col-span-6 md:inline-flex">
          <span className="text-3xl font-bold italic ">
            Tap on chat to start messaging
          </span>
        </div>
      )}
    </>
  );
};

export default ChatSection;
