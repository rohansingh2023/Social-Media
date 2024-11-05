import { useContext } from "react";
import ChatInfoCard from "./ChatInfoCard";
import { useCurrentState } from "../../state-management/current-user";
import { OnlineUsersContext } from "../../state-management/online-users";

const ChatInfo = () => {
  const { currentUser } = useCurrentState();
  const context = useContext(OnlineUsersContext);

  if (!context) {
    return <div>Error: GlobalContext not found!</div>;
  }

  const { onlineUsers } = context;
  
  const olFriends = currentUser?.user?.friends.filter(friend => 
    onlineUsers?.some((user: { _id: string; }) => user._id === friend.userId)
  );

  return (
    <div className="hidden max-h-[91vh] bg-[#010100] text-white md:col-span-3 md:inline">
      <div className=" px-3 py-2 font-Inter">
        <h1 className="text-2xl font-bold">Active Users</h1>
      </div>
      <div className="max-h-[83vh] cursor-pointer overflow-y-scroll scrollbar-hide">
        {olFriends?.map((u, i) => (
          <ChatInfoCard key={i} friendInfo={u} />
        ))}
      </div>
    </div>
  );
};

export default ChatInfo;
