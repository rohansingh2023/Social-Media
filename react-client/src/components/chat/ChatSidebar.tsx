import React, { Dispatch, SetStateAction,  useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BeakerIcon, PencilIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import ChatListCard from "./ChatListCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatListLoading from "./ChatListLoading";
import DialogBox from "../shared-modules/custom-dialog-box/DialogBox";
import ApiProxyService from "../../services/api-service";

interface IProps {
  isChatOpen: boolean;
  setIsChatOpen: Dispatch<SetStateAction<boolean>>;
  currentChat: Conversation | undefined;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
}

const ChatSidebar = ({ isChatOpen, setIsChatOpen, setCurrentChat }: IProps) => {
  const [convs, setConvs] = useState<Conversation[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const { id } = useParams();
  const apiService = new ApiProxyService({
    baseUrl: "http://localhost:9090"
  })

  useEffect(() => {
    const getConvs = async () => {
      setLoading(true);
      try {
        const res = await apiService.get<Conversation[]>(`api/conversation/user/${id}`)
        setConvs(res.data);
        setLoading(false);
      } catch (error) {
        toast.error(`${error}`);
        setError(error)
        setLoading(false);
        console.log(error);
      }
    };
    getConvs();
  }, []);

  const openAddConversation = ()=>{
    
  }

  const handleOkClick = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {isDialogOpen && (
      <DialogBox
        title="GraphQL Error"
        description={error?.message}
        isOpen = {isDialogOpen} 
        onOk={handleOkClick}
        onClose={handleOkClick}
      />
    )}
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
        <div className="flex items-center">
        <BeakerIcon
          // onClick={handleRefresh}
          className="mr-5 h-6 w-6 cursor-pointer text-[#FF8080] transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />

        <PencilIcon
        onClick={openAddConversation}
        className="mr-2 h-6 w-6 cursor-pointer text-[#FF8080] transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />

        </div>
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
        {!loading ? (
          convs?.map((u) => (
            <ChatListCard
              key={u._id}
              conv={u}
              setIsChatOpen={setIsChatOpen}
              setCurrentChat={setCurrentChat}
              loading={loading}
            />
          ))
        ) : (
          <>
            <ChatListLoading />
            <ChatListLoading />
            <ChatListLoading />
            <ChatListLoading />
            <ChatListLoading />
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default ChatSidebar;
