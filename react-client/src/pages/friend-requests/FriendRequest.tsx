// import { useQuery } from '@apol
import { useCurrentState } from "../../state-management/current-user";
import { Leftbar, Rightbar } from "../../components";
import { useQuery } from "@apollo/client";
import { GET_FRIEND_REQUESTS } from "../../graphql/queries/userQueries";
import FriendRequestContainer from "../../components/friend-Request-Container/FriendRequestContainer";

const FriendRequest = () => {
  const currentUser = useCurrentState((state) => state.currentUser);

  const { data, loading } = useQuery(GET_FRIEND_REQUESTS, {
    variables: {
      id: currentUser?.user?._id,
    },
  });
  const userData: friendRequests[] = data?.userById?.user?.friendRequests;

  if (loading) {
    console.log("loading");
  }

  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden font-DMSerif">
      <div className="row-span-10 grid grid-cols-12">
        <Leftbar />
        <FriendRequestContainer user={userData} />
        <Rightbar />
      </div>
    </div>
  );
};

export default FriendRequest;
