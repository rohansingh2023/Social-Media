import React, { Dispatch, SetStateAction } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BeakerIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
// import axios from 'axios'
import ChatListCard from "./ChatListCard";

interface IProps {
  //   user: User;
  isChatOpen: boolean;
  setIsChatOpen: Dispatch<SetStateAction<boolean>>;
  conversations: Conversation[];
  currentChat: Conversation | undefined;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
}

const ChatSidebar = ({
  //   user,
  isChatOpen,
  setIsChatOpen,
  conversations,
  setCurrentChat,
}: IProps) => {
  //   const [convs, setConvs] = useState<Conversation[]>(conversations)

  const handleRefresh = async () => {
    try {
      const refreshToast = toast.loading("Refreshing...");
      //   const res = await axios.get(
      //     `http://localhost:3001/api/conversation/${user._id}`
      //   )
      // setConvs(res.data)
      // console.log(res.data)

      toast.success("ChatList Updated", {
        id: refreshToast,
      });
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  if (!conversations) {
    return "Loading";
  }

  return (
    <div
      className={
        isChatOpen
          ? "hidden bg-[#010100] text-white font-Inter md:col-span-3 md:inline"
          : "col-span-12 bg-[#010100] text-white font-Inter md:col-span-3"
      }
    >
      {/* Chat header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h1 className="text-xl font-bold">Chats</h1>
        <BeakerIcon
          onClick={handleRefresh}
          className="mr-5 h-6 w-6 cursor-pointer text-[#FF8080] transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />
      </div>

      {/* SearchBar */}
      <div className="mx-4 mt-2 flex items-center rounded-full bg-gray-200 px-3 py-2">
        <AiOutlineSearch />
        <input
          type="text"
          placeholder="Search Chats"
          className="ml-2 flex-1 bg-gray-200 outline-none placeholder:text-gray-600"
        />
      </div>

      {/* Chat List */}
      <div className="h-[77vh] cursor-pointer overflow-y-scroll py-2">
        {conversations?.map((u) => (
          <ChatListCard
            key={u._id}
            conv={u}
            setIsChatOpen={setIsChatOpen}
            setCurrentChat={setCurrentChat}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
