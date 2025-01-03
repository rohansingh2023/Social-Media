import { Outlet } from "react-router-dom";
import { useCurrentState } from "./state-management/current-user";
import { lazy, useEffect, useState } from "react";
import { socket } from "./utils/web-socket";
import { AnswerVideoChat } from "./components";
import { useVideoCardState } from "./state-management/show-video-card";
import AcceptedVideoChat from "./components/video-chat/AcceptedVideoChat";

const NavbarLazy = lazy(() => import("./components/navbar/Navbar"));

const Layout = () => {
  const { addCurrentUser, loading, error } = useCurrentState();
  const [answerVideoChatVisible, setAnswerVideoChatVisible] =
    useState<boolean>(false);
  const { showVideoChatCard, setShowVideoChatCard } = useVideoCardState();
  const [currentUserId, setCurrentUserId] = useState<String | undefined>();
  const [currentName, setCurrentName] = useState<String | undefined>();
  const [data, setData] = useState<any>();
  const userId = localStorage.getItem("my-id")

  useEffect(() => {
    addCurrentUser(userId);
    socket.on("sendOffer", (data) => {
      // console.log(data.sdp);
      setCurrentUserId(data?.userId);
      setCurrentName(data?.name);
      setAnswerVideoChatVisible(true);
      setData(data)
      // setShowVideoChatCard(true)
    });
  }, [addCurrentUser]);

  if (loading) {
    console.log("Fetching current user data");
  }

  if (error) {
    console.log(error);
  }

  return (
    <>
      {answerVideoChatVisible && (
        <AnswerVideoChat
          answerVideoChatVisible={answerVideoChatVisible}
          currentName = {currentName}
          setAnswerVideoChatVisible={setAnswerVideoChatVisible}
        />
      )}
      {showVideoChatCard && <AcceptedVideoChat data={data} currentUserId={currentUserId} />}
      <div
        className={
          answerVideoChatVisible
            ? "overflow-hidden transition-all duration-0 blur-sm"
            : "overflow-hidden"
        }
      >
        <NavbarLazy />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
