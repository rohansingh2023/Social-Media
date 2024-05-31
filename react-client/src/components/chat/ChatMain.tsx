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

  const getConverstaions = async (id: string) => {
    const res = await axios.get(`http://localhost:3001/api/conversation/${id}`);
    return res.data;
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConverstaions(user?._id),
  });

  useEffect(() => {
    if (isSuccess) {
      setConversations(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    socket.on("test2", (data) => {
      alert(data.message);
    });
  }, []);
  console.log(user?._id);

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
