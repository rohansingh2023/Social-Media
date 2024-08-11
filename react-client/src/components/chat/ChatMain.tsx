import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatSection from "./ChatSection";

interface IProps {
  user: User;
}

const ChatMain = ({ user }: IProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [currentChat, setCurrentChat] = useState<Conversation>();

  return (
    <div className="mx-auto grid max-h-[91vh] grid-cols-12 overflow-hidden">
      <ChatSidebar
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <ChatSection
        isChatOpen={isChatOpen}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      {/* <ChatInfo user={user} /> */}
    </div>
  );
};

export default ChatMain;
