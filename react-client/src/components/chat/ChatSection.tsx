import React, { useEffect, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoMdPhotos } from "react-icons/io";
import axios from "axios";
import { socket } from "../../utils/web-socket";
import { useCurrentState } from "../../state-management/current-user";
import MessageCard from "./MessageCard";
import { IoCall } from "react-icons/io5";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { AiOutlineMore } from "react-icons/ai";
import client from "../../services/apollo-client";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";

interface IProps {
  isChatOpen: boolean;
  currentChat: Conversation | undefined;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
}

const ChatSection = ({ isChatOpen, currentChat }: IProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState<string>("");
  const currentUser = useCurrentState((state) => state.currentUser);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [otherUser, setOtherUser] = useState<User>();

  const receiverId = currentChat?.members.find(
    (m) => m !== currentUser?.user?._id
  );

  useEffect(() => {
    const getOtherUser = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_BY_ID,
          variables: {
            id: receiverId,
          },
        });
        setOtherUser(data?.userById?.user);
      } catch (error) {
        console.log(error);
      }
    };
    getOtherUser();
  }, [receiverId]);

  useEffect(() => {
    const checkConv = async () => {
      try {
      } catch (error) {}
    };
    checkConv();
  }, []);

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
          `http://localhost:8080/api/message/${currentChat?._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

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
          "http://localhost:8080/api/message/",
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
            <div className="flex flex-[0.05] items-center justify-between bg-[#191818] px-3 py-2">
              <div className="flex items-center">
                <img
                  src={otherUser?.profilePic}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h1 className="mx-3 text-lg font-semibold">
                  {otherUser?.name}
                </h1>
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
            </div>

            {/* Chats */}
            <div className="flex-[0.90] overflow-y-scroll border-x bg-[#010100] text-white">
              {messages?.map((m, i) => (
                <div ref={scrollRef} key={i}>
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
