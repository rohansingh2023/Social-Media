import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../../graphql/queries/postQueries";
import { lazy, useEffect, useState } from "react";
import DialogBox from "../../components/shared-modules/custom-dialog-box/DialogBox";

const Feed = lazy(() => import("../../components/feed/Feed"));
const Leftbar = lazy(() => import("../../components/leftbar/Leftbar"));
const Rightbar = lazy(() => import("../../components/rightbar/Rightbar"));

const Home = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { loading, data , error} = useQuery(GET_POSTS, {});
  const acesss_token = localStorage.getItem("userToken");
  const matches = acesss_token?.match(/"(.*?)"/);
  console.log(matches && matches[1]);

  useEffect(()=>{
    if(error){
      setDialogOpen(true)
    }
  },[error])

  const handleOkClick = () => {
    setDialogOpen(false);
  };

  return (
    <>
     {isDialogOpen && (
      <DialogBox
        title="GraphQL Error"
        description={error?.message}
        isOpen = {isDialogOpen}
        onOk={handleOkClick}
        onClose={handleOkClick}
      />
    )}
    <div className="bg-[#010100] font-Segoe">
      <div className="grid grid-cols-12 h-screen ">
        <Leftbar />
        <Feed postData={data?.posts} loading={loading} />
        <Rightbar />
      </div>
    </div>
    </>
  );
};

export default Home;
