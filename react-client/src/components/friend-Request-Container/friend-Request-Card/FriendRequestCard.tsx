import moment from "moment";
import { useMutation } from "@apollo/client";
import {
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
} from "../../../graphql/mutations/userMutations";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { GET_FRIEND_REQUESTS } from "../../../graphql/queries/userQueries";

interface Props {
  user: friendRequests;
  //   refresh: () => Promise<void>
}

const FriendRequestCard = ({ user }: Props) => {
  //   const router = useNavigate()
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);

  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    variables: {
      email: user.email,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  });

  const [declineFriendRequest] = useMutation(DECLINE_FRIEND_REQUEST, {
    variables: {
      email: user.email,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  });

  console.log(user);

  const handleRequest = async () => {
    try {
      await acceptFriendRequest();
      toast.success(`${user.name}'s friend Request accepted Successfully!!`);
      // await refresh()
      //   router.reload()
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await declineFriendRequest();
      toast.success(`${user.name}'s friend Request declined Successfully!!`);
      // await refresh()
      //   router.reload()
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  return (
    <div className="mt-10 flex flex-1 items-center rounded-md border border-gray-200 bg-[#191818] text-white p-5">
      <div className="flex-[0.2]">
        {user?.profilePic && (
          <img
            src={user.profilePic}
            alt=""
            height={80}
            width={80}
            className="rounded-full bg-white object-contain md:h-32 md:w-32"
          />
        )}
      </div>
      <div className="ml-5 flex flex-[0.8] flex-col">
        <div className="flex flex-1 items-center justify-between border-b-[1px] border-b-gray-400">
          <div>
            <p className="text-lg font-bold md:text-xl">{user.name}</p>
            <p className="md:text-md text-sm font-semibold text-gray-500">
              {user.email}
            </p>
          </div>
          <div className="text-sm font-light text-gray-400">
            {moment(user.createdAt).fromNow()}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            className="m-2 flex flex-1 items-center justify-center rounded-lg bg-blue-700 px-2 py-1 text-white hover:bg-blue-500 md:px-4 md:py-2"
            onClick={handleRequest}
          >
            Accept
          </button>
          <Link to={`/user/${user.userId}`}>
            <button className="m-2 flex flex-1 items-center justify-center rounded-lg bg-purple-600 px-2 py-1 text-white hover:bg-purple-400 md:px-4 md:py-2 ">
              View
            </button>
          </Link>
          <button
            className="m-2 flex flex-1 items-center justify-center rounded-lg bg-red-600 px-2 py-1 text-white hover:bg-red-400 md:px-4 md:py-2"
            onClick={handleDeclineRequest}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
