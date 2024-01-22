import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { UNFRIEND } from "../../graphql/mutations/userMutations";
// import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

interface IProps {
  user: friends;
  //   refresh: () => Promise<void>
}

const FriendCard = ({ user }: IProps) => {
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);
  //   const router = useNavigate()

  const [unFriend] = useMutation(UNFRIEND, {
    variables: {
      email: user.email,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  });

  const handleUnFriend = async () => {
    try {
      const refreshToast = toast.loading("Unfriending...");
      await unFriend();
      toast.success(`${user.name} Unfriended successfully`, {
        id: refreshToast,
      });
      // await refresh()
      //   router.reload()
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  return (
    <div className="mt-2 shadow-2xl flex cursor-pointer items-center justify-between rounded-sm py-2 px-2 bg-[#191818] text-white hover:bg-[#010100]">
      <div className="flex items-center">
        <img
          src={user.profilePic}
          alt=""
          className="h-7 w-7 rounded-full object-fill"
        />
        <h1 className="ml-3 text-base text-gray-500">{user.name}</h1>
      </div>
      <div className="flex items-center">
        <Link to={`/user/${user.userId}`}>
          <button className="m-3 rounded-md bg-blue-500 py-1 px-2 text-sm text-white hover:bg-blue-700">
            View
          </button>
        </Link>
        <button
          type="submit"
          className="m-3 rounded-md bg-red-500 py-1 px-2 text-sm text-white hover:bg-red-700"
          onClick={handleUnFriend}
        >
          UnFriend
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
