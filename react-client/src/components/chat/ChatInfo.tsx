import { useEffect, useState } from "react";
import ChatInfoCard from "./ChatInfoCard";
import { socket } from "../../utils/web-socket";

interface IProps {
  user: User;
  //   conv: Conversation[]
}

const ChatInfo = ({ user }: IProps) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // / Listen for the getUsers event from the server
    socket.on("getUsers", (users) => {
      // setOnlineUsers(users.map((user: { userId: string, name: string, email: string, profilePic: string, socketId: string }) => user.userId, user.));
      console.log(users);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="hidden max-h-[91vh] bg-[#010100] text-white md:col-span-3 md:inline">
      <div className=" px-3 py-2 font-Inter">
        <h1 className="text-2xl font-bold">Active Users</h1>
      </div>
      <div className="max-h-[83vh] cursor-pointer overflow-y-scroll scrollbar-hide">
        {user?.friends?.map((u) => (
          <ChatInfoCard key={u._id} friendInfo={u} />
        ))}
      </div>
    </div>
  );
};

export default ChatInfo;
