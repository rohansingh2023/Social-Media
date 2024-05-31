import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../../graphql/queries/postQueries";
import { lazy } from "react";
// import { useCurrentState } from "../../state-management/current-user";

const Feed = lazy(() => import("../../components/feed/Feed"));
const Leftbar = lazy(() => import("../../components/leftbar/Leftbar"));
const Rightbar = lazy(() => import("../../components/rightbar/Rightbar"));

const Home = () => {
  const { loading, data } = useQuery(GET_POSTS, {});
  // const currentUser = useCurrentState((state) => state.currentUser);

  if (loading) {
    console.log("Loading");
  }

  // console.log(currentUser.user._id);

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
