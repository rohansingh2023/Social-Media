import ChatInfoCard from "./ChatInfoCard";

interface IProps {
  user: User;
  //   conv: Conversation[]
}

const ChatInfo = ({ user }: IProps) => {
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
