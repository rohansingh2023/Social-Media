import axios from "axios";
import toast from "react-hot-toast";
import { HiOutlineUserAdd } from "react-icons/hi";
import { useParams } from "react-router-dom";

interface OnlineUsers {
  email: string;
  name: string;
  profilePic?: string;
  socketId: string;
  userId: string;
}

interface IProps {
  friendInfo: friends;
}

const ChatInfoCard = ({ friendInfo }: IProps) => {
  const { id } = useParams();

  const handleCreateConv = async () => {
    const tid = toast.loading("Creating Conversation...");
    try {
      await axios.post("http://localhost:8080/api/conversation/", {
        senderId: friendInfo?._id,
        receiverId: id,
      });
      toast.success(
        `Conversation with ${friendInfo?.name} created successfully`,
        {
          id: tid,
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(`${error}`, {
        id: tid,
      });
    }
  };

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
          <p>🟢</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoCard;
