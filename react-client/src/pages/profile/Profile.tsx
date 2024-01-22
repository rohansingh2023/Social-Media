import { useQuery } from "@apollo/client";
import { useCurrentState } from "../../state-management/current-user";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";
import { Leftbar, Rightbar, UserProfile } from "../../components";

const Profile = () => {
  const currentUser = useCurrentState((state) => state.currentUser);

  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: currentUser?.user?._id,
    },
  });

  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden bg-gray-100 font-DMSerif">
      <div className="row-span-10 grid grid-cols-12">
        <Leftbar />
        <UserProfile
          userD={data?.userById?.user}
          post={data?.userById?.posts}
          loading={loading}
        />
        <Rightbar />
      </div>
    </div>
  );
};

export default Profile;
