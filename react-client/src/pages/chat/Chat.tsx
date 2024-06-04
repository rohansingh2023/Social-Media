import { useEffect } from "react";
import { ChatMain } from "../../components";
import { socket } from "../../utils/web-socket";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";
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

    // // Cleanup on component unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const { data } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: currentUser?.user?._id,
    },
  });

  return (
    <div>
      {/* <Navbar /> */}
      <ChatMain user={data?.userById?.user} />
    </div>
  );
};

export default Chat;
