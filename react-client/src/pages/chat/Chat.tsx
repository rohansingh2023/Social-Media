import { useEffect } from "react";
import { ChatMain } from "../../components";
import { socket } from "../../utils/web-socket";
import { useCurrentState } from "../../state-management/current-user";

const Chat = () => {
  const currentUser = useCurrentState((state) => state.currentUser);

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
      <ChatMain />
    </div>
  );
};

export default Chat;
