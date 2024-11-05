import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";
import { socket } from "../../utils/web-socket";
import { useCurrentState } from "../../state-management/current-user";
import client from "../../services/apollo-client";
import "react-loading-skeleton/dist/skeleton.css";
import ChatListLoading from "./ChatListLoading";
import { OnlineUsersContext } from "../../state-management/online-users";

interface IProps {
  conv: any;
  setIsChatOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentChat: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
  loading: boolean;
}

const ChatListCard = ({
  setIsChatOpen,
  conv,
  setCurrentChat,
  loading,
}: IProps) => {
  const currentUser = useCurrentState((state) => state.currentUser);
  const [convChats, setConvChats] = useState<User>();
  const context = useContext(OnlineUsersContext);

  if (!context) {
    return <div>Error: GlobalContext not found!</div>;
  }

  const { onlineUsers } = context;

  useEffect(() => {
    const friendId = conv?.members?.find(
      (m: string) => m !== currentUser?.user?._id
    );

    const getUser = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_BY_ID,
          variables: {
            id: friendId,
          },
        });
        setConvChats(data?.userById?.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conv]);

  if (loading) {
    return <ChatListLoading />;
  }

  const setCreds = () => {
    setIsChatOpen(true);
    setCurrentChat(conv);
    socket.emit("addUser", { room: conv?._id });
  };

  const isUserOnline: boolean = onlineUsers?.some(
    (user: { _id: string | undefined }) => user._id === convChats?._id
  );

  return (
    <div
      className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter bg-[#191818] hover:bg-[#010100] text-white"
      onClick={setCreds}
    >
      <img
        src={convChats?.profilePic}
        alt=""
        className="h-12 w-12 rounded-full object-cover"
      />
      {isUserOnline && <p className="-ml-3 mt-5">🟢</p>}
      <div className="ml-3 flex flex-col">
        <h1 className="text-sm font-semibold">{convChats?.name}</h1>
        <p className="text-xs font-light">{convChats?.email}</p>
      </div>
    </div>
  );
};

export default ChatListCard;
