import { useQuery } from "@apollo/client";
import { Feed, Leftbar, Rightbar } from "../../components";
import { GET_POSTS } from "../../graphql/queries/postQueries";

const Home = () => {
  const { loading, data } = useQuery(GET_POSTS, {});

  // console.log(data.posts);
  if (loading) {
    console.log("Loading");
  }

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
