import { useEffect, useState } from "react";
import ChatInfoCard from "./ChatInfoCard";
import { socket } from "../../utils/web-socket";
import { useCurrentState } from "../../state-management/current-user";

interface OnlineUsers {
  email: string;
  name: string;
  profilePic?: string;
  socketId: string;
  userId: string;
}

const ChatInfo = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);
  const [myFriends, setMyFriends] = useState<friends[]>([]);
  const { currentUser } = useCurrentState();

  useEffect(() => {
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
      // console.log(users);
    });
    setMyFriends(currentUser?.user?.friends);
  }, []);

  console.log(myFriends);

  return (
    <div className="hidden max-h-[91vh] bg-[#010100] text-white md:col-span-3 md:inline">
      <div className=" px-3 py-2 font-Inter">
        <h1 className="text-2xl font-bold">Active Users</h1>
      </div>
      <div className="max-h-[83vh] cursor-pointer overflow-y-scroll scrollbar-hide">
        {myFriends?.map((u, i) => (
          <ChatInfoCard key={i} friendInfo={u} />
        ))}
      </div>
    </div>
  );
};

export default ChatInfo;
