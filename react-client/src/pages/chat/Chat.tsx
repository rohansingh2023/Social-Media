import { useEffect } from "react";
import { ChatMain } from "../../components";
import { socket } from "../../utils/web-socket";
import { useQuery } from "@apollo/client";
import {
  CURRENT_USER,
  GET_USER_BY_ID,
} from "../../graphql/queries/userQueries";
import { useCurrentState } from "../../state-management/current-user";

const Chat = () => {
  const currentUser = useCurrentState((state) => state.currentUser);

  const { data } = useQuery(CURRENT_USER);

  // console.log(data?.currentUser?.user);

  useEffect(() => {
    socket.emit("login", {
      userId: currentUser?.user?._id,
      name: currentUser?.user?.name,
      email: currentUser?.user?.email,
      profielPic: currentUser?.user?.profilePic,
    });
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <ChatMain user={data?.currentUser?.user} />
    </div>
  );
};

export default Chat;
