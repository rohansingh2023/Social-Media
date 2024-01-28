import React, { useEffect, useState } from "react";
import { socket } from "../../utils/web-socket";
import ChatSidebar from "./ChatSidebar";
import ChatSection from "./ChatSection";
import ChatInfo from "./ChatInfo";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface IProps {
  user: User;
}

const ChatMain = ({ user }: IProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentChat, setCurrentChat] = useState<Conversation>();

  const getConverstaions = async (
    id: string,
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  ) => {
    const res = await axios.get(`http://localhost:3001/api/conversation/${id}`);
    setConversations(res.data);
    return res.data;
  };

  const { data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConverstaions(user?._id, setConversations),
  });

  useEffect(() => {
    socket.on("test2", (data) => {
      alert(data.message);
    });
  }, []);
  console.log(conversations);

  return (
    <div className="mx-auto grid max-h-[91vh] grid-cols-12 overflow-hidden">
      <ChatSidebar
        // user={user}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        conversations={conversations}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <ChatSection
        isChatOpen={isChatOpen}
        // setIsChatOpen={setIsChatOpen}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <ChatInfo user={user} />
    </div>
  );
};

export default ChatMain;
