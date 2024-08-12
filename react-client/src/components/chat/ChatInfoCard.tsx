import { HiOutlineUserAdd } from "react-icons/hi";

interface OnlineUsers {
  email: string;
  name: string;
  profilePic?: string;
  socketId: string;
  userId: string;
}

interface IProps {
  friendInfo: OnlineUsers;
}

const ChatInfoCard = ({ friendInfo }: IProps) => {
  return (
    <div className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter hover:bg-[#191818]">
      <img
        src={friendInfo?.profilePic}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="ml-3 flex flex-1 items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="font-semibold">{friendInfo?.name}</h1>
          <p className="text-sm font-light">{friendInfo?.email}</p>
        </div>
        <div>
          <HiOutlineUserAdd size={25} />
        </div>
      </div>
    </div>
  );
};

export default ChatInfoCard;
