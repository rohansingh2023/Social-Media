import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../../graphql/queries/postQueries";
import { lazy, useEffect } from "react";
import { socket } from "../../utils/web-socket";
import { useCurrentState } from "../../state-management/current-user";

const Feed = lazy(() => import("../../components/feed/Feed"));
const Leftbar = lazy(() => import("../../components/leftbar/Leftbar"));
const Rightbar = lazy(() => import("../../components/rightbar/Rightbar"));

const Home = () => {
  const { loading, data } = useQuery(GET_POSTS, {});
  const currentUser = useCurrentState((state) => state.currentUser);

  // if (loading) {
  //   console.log("Loading");
  // }

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

  // console.log(currentUser.user.name);

  return (
    <div className="bg-[#010100] font-Segoe">
      <div className="grid grid-cols-12 h-screen ">
        <Leftbar />
        <Feed postData={data?.posts} loading={loading} />
        <Rightbar />
      </div>
    </div>
  );
};

export default Home;
