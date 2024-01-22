import { useEffect, useState } from "react";
import { Post } from "../../components";
import { FaUniversity, FaBirthdayCake } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { BiOutline } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { TiTick } from "react-icons/ti";
import { RiAddLine } from "react-icons/ri";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_FRIEND_REQUEST } from "../../graphql/mutations/userMutations";
import { useCurrentState } from "../../state-management/current-user";
import Cookies from "js-cookie";
import client from "../../services/apollo-client";
import { GET_POST_BY_ID } from "../../graphql/queries/postQueries";
import { Link, useLocation } from "react-router-dom";

function UserInfo() {
  const [friendInfo, setFriendInfo] = useState<User>();
  const currentUser = useCurrentState((state) => state.currentUser);
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);

  const location = useLocation();
  const url = location.pathname.split("/")[2];

  const { data: mainData } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: url,
    },
  });

  const [friendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    variables: {
      id: mainData?.userById?.user?._id,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [
      { query: GET_POST_BY_ID, variables: { id: currentUser?.user?._id } },
    ],
  });

  useEffect(() => {
    const getUserFriend = async () => {
      try {
        const { data } = await client.query({
          query: GET_USER_BY_ID,
          variables: {
            id: mainData?.userById?.user?._id,
          },
        });
        setFriendInfo(data?.userById?.user);
        // setUser(data?.userById?.user);
        // setPosts(data?.userById?.posts);
      } catch (error) {
        console.log(error);
      }
    };
    getUserFriend();
  }, [mainData?.userById?.user?._id]);

  const isFriend = currentUser?.user?.friends?.findIndex(
    (f) => f.userId.toString() === mainData?.userById?.user?._id.toString()
  );

  const isRequestSent = friendInfo?.friendRequests?.findIndex(
    (f) => f.userId.toString() === currentUser?.user?._id.toString()
  );

  const handleRequest = async () => {
    // socket.emit('sent_request', {
    //   cUser: {
    //     name: currentUser?.user?.name,
    //     id: currentUser?.user?._id,
    //     img: currentUser?.user?.profilePic,
    //   },
    //   name: user.name,
    //   id: user._id,
    // })

    try {
      const refresh = toast.loading("Sending friend Request...");
      await friendRequest();
      toast.success("Request Sent", {
        id: refresh,
      });
      //   router.reload()
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="h-auto bg-[#010100] text-white font-Inter">
        {/* Top */}
        <div className="flex h-auto flex-col bg-[#191818]">
          <div className="mx-auto h-[200px] w-full flex-shrink-0 rounded-t-md  opacity-70 lg:h-[400px] lg:w-[75%]">
            <img
              src="https://tse3.mm.bing.net/th?id=OIP.zsEgRepQ6Uh5OYkkhJyn2gHaE5&pid=Api&P=0&w=253&h=167"
              alt=""
              className="mx-auto h-full w-full rounded-b-lg object-cover"
            />
          </div>
          <div className="mx-auto h-64 w-[70%] rounded-b-md lg:h-40">
            <div className="flex flex-col lg:flex-row">
              {/* <div> */}
              {mainData?.userById?.user?.profilePic && (
                <img
                  src={mainData?.userById?.user.profilePic}
                  alt=""
                  height={150}
                  width={150}
                  loading="lazy"
                  className="z-40 mx-auto -mt-20 h-44 w-44 rounded-full object-cover md:ml-10 lg:-mt-10 lg:ml-5"
                />
              )}
              {/* </div> */}
              <div className="ml-5 mt-1 flex flex-1 flex-col lg:relative lg:mt-5">
                <h2 className="text-center text-3xl font-bold  lg:text-left">
                  {mainData?.userById?.user?.name}
                </h2>
                <div className=" flex flex-1 flex-col items-center lg:flex-row">
                  <div className="flex flex-1 flex-col">
                    <p className="mt-3 text-lg font-semibold text-gray-400">
                      {mainData?.userById?.user &&
                      mainData?.userById?.user?.friends?.length > 1
                        ? `${mainData?.userById?.user?.friends.length} friends`
                        : `${mainData?.userById?.user?.friends.length} friend`}
                    </p>
                    <div className="flex items-center">
                      {mainData?.userById?.user?.friends.map((u: friends) => (
                        <img
                          src={u?.profilePic}
                          alt=""
                          height={28}
                          width={28}
                          loading="lazy"
                          className=" h-7 w-7 rounded-full object-cover"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-start justify-between">
                    <button
                      onClick={handleRequest}
                      disabled={isFriend !== -1 || isRequestSent !== -1}
                      className={
                        isFriend !== -1
                          ? "flex h-10 items-center rounded-md bg-gray-300 p-3 text-center font-semibold outline-none hover:bg-gray-400 lg:absolute lg:right-7 lg:bottom-0 lg:justify-center"
                          : isRequestSent !== -1
                          ? "flex h-10 items-center rounded-md bg-green-500 p-3 text-center font-semibold text-white outline-none hover:bg-orange-400 lg:absolute lg:right-7 lg:bottom-0 lg:justify-center"
                          : "flex h-10 items-center rounded-md bg-[#FF8080] p-3 text-center font-semibold text-white outline-none hover:bg-orange-400 lg:absolute lg:right-7 lg:bottom-0 lg:justify-center"
                      }
                    >
                      {isFriend !== -1 ? (
                        <TiTick />
                      ) : isRequestSent !== -1 ? (
                        <TiTick />
                      ) : (
                        <RiAddLine />
                      )}

                      {isFriend !== -1
                        ? "Friends"
                        : isRequestSent !== -1
                        ? "Request Sent"
                        : "Add Friend"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mx-auto flex max-w-5xl flex-col lg:flex-row">
          <div className="flex-[0.5]">
            <div className="m-5 w-[90%] rounded-md bg-[#191818] p-3">
              <h1 className="text-xl font-bold">Intro</h1>
              <div className="mt-3">
                <div className="my-4 mx-1 flex items-center space-x-2 ">
                  <FaUniversity size={20} color="gray" />
                  <p className="text-base text-gray-500">
                    Went to Harvard University
                  </p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <MdOutlineMail size={20} color="gray" />
                  <p className="text-base text-gray-500">
                    {mainData?.userById?.user?.email}
                  </p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <BiOutline size={20} color="gray" />
                  <p className="text-base text-gray-500">
                    {mainData?.userById?.user?.bio}
                  </p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <FaBirthdayCake size={20} color="gray" />
                  <p className="text-base text-gray-500">
                    {mainData?.userById?.user?.dob}
                  </p>
                </div>
                <div className="my-4 mx-1 flex items-center space-x-2">
                  <GrLocation size={20} color="gray" />
                  <p className="text-base text-gray-500">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>

            <div className="m-5 w-[90%] rounded-md bg-[#191818] p-3">
              <h1 className="text-xl font-bold">Friends</h1>
              <div className="mt-3">
                {mainData?.userById?.user?.friends?.map((f: friends) => (
                  <Link to={`/user/${f.userId}`}>
                    <div
                      className="my-4 mx-1 flex cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-[#010100]"
                      key={f._id}
                    >
                      {f?.profilePic && (
                        <img
                          src={f.profilePic}
                          alt=""
                          height={40}
                          width={40}
                          loading="lazy"
                          className="rounded-full object-cover"
                        />
                      )}
                      <p className="text-base text-gray-500">{f.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative flex-[0.5]">
            {mainData?.userById?.posts &&
            mainData?.userById?.posts?.length > 0 ? (
              <div className="m-5 mx-auto w-[90%]">
                {mainData?.userById?.posts?.map((p: Post) => (
                  <Post user={mainData?.userById?.user} post={p} key={p._id} />
                ))}
              </div>
            ) : (
              <div className="absolute top-56 left-44">
                <span className="text-xl font-bold italic">
                  No Post to show
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
