import { useState } from "react";
import { IoPencilSharp } from "react-icons/io5";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import { FriendCard, Post } from "..";

interface Props {
  userD: User;
  post: Post;
  loading: boolean;
}

interface Props2 {
  posts: Post;
  user: User;
}

function UserProfile({ userD, post, loading }: Props) {
  const [userPosts, setUserPosts] = useState<Props2[]>([]);
  const [userData, setUserData] = useState<User>(userD);
  const [showModal, setShowModal] = useState<boolean>(false);
  //   const router = useNavigate();

  // const [unFriend] = useMutation(UNFRIEND, {
  //   variables:{
  //     id: userD.id
  //   }
  // })

  //   const handleRefresh = async () => {
  //     const refreshToast = toast.loading('Refreshing...')
  //     const users = await getUserById(userD?._id)
  //     setUserData(users)
  //     toast.success('User Updated', {
  //       id: refreshToast,
  //     })
  //   }

  // useEffect(() => {
  //   const getUserById = async () => {
  //     const results: Props2[] = await client.query(GET_USER_BY_ID)
  //     setUserPosts(results)
  //   }
  //   getUserById()
  // }, [])

  // if (!userPosts) {
  //   return <Loading />
  // }
  if (loading) {
    console.log("Loading...");
  }

  return (
    <div className="relative col-span-12 flex max-h-[91vh] bg-[#010100] text-white max-w-screen-sm flex-1 flex-col overflow-y-scroll p-3 scrollbar-hide md:max-w-screen-md lg:col-span-8 lg:max-w-screen-lg lg:border-x lg:p-5 xl:col-span-6 xl:max-w-screen-xl">
      <div className="mt-5 flex flex-1 flex-shrink-0 flex-col lg:mt-0">
        {/* {showModal && (
          <UserModal
            showModal={showModal}
            setShowModal={setShowModal}
            user={userD}
          />
        )} */}
        <div className="h-80 w-full flex-shrink-0 rounded-t-md  opacity-70">
          <img
            src="https://tse3.mm.bing.net/th?id=OIP.zsEgRepQ6Uh5OYkkhJyn2gHaE5&pid=Api&P=0&w=253&h=167"
            alt=""
            className="h-full w-full rounded-t-md object-cover"
          />
        </div>
        <div className="h-64 w-full rounded-b-md bg-[#191818] shadow-lg lg:h-40">
          <div className="flex flex-col lg:flex-row">
            {/* <div> */}
            {userD?.profilePic && (
              <img
                src={userD.profilePic}
                alt=""
                height={160}
                width={160}
                className="z-40 mx-auto -mt-10  h-40 w-40 rounded-full object-cover md:ml-10 lg:ml-5"
              />
            )}
            {/* </div> */}
            <div className="relative ml-5 flex flex-1 flex-col ">
              <h2 className="text-xl font-bold">{userD?.name}</h2>
              <p className="text-sm font-thin text-gray-400">{userD?.email}</p>
              <div className=" flex flex-1">
                <div className="flex flex-1 flex-col">
                  <p className="text-md mt-3 font-semibold text-gray-400">
                    {userD?.friends.length > 1
                      ? `${userD?.friends.length} friends`
                      : `${userD?.friends.length} friend`}
                  </p>
                  <div className="flex items-center">
                    {userD?.friends.map(
                      (u, i) =>
                        u?.profilePic && (
                          <img
                            key={i}
                            src={u.profilePic}
                            alt=""
                            height={28}
                            width={28}
                            className=" h-7 w-7 rounded-full object-cover"
                          />
                        )
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(!showModal)}
                  className="absolute right-7 bottom-0 flex h-10 items-center justify-center rounded-md bg-[#010100] text-white p-3 text-center font-semibold outline-none hover:bg-gray-400"
                >
                  <IoPencilSharp />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={userPosts.length > 0 ? "p-5" : "mt-10 p-5"}>
        <hr className="mt-10 border bg-black" />
      </div>
      <div className="mx-auto max-w-xl">
        {userData?.friends.length > 0 && (
          <div className="m-5 w-[90%] rounded-md p-3">
            <h1 className="text-xl font-bold text-white">Friends</h1>
            <div className="mt-3">
              {userData?.friends?.map((f) => (
                <FriendCard user={f} key={f._id} />
              ))}
            </div>
          </div>
        )}

        {userData?.friendRequests.length > 0 && (
          <div className="m-5 w-[90%] rounded-md p-3">
            <h1 className="text-xl font-bold">Friend Requests</h1>
            <div className="mt-3">
              {userData?.friendRequests?.map((u, i) => (
                <div
                  className="mt-2 flex cursor-pointer items-center rounded-sm py-2 px-2 hover:bg-gray-200"
                  key={i}
                >
                  {u?.profilePic && (
                    <img
                      src={u.profilePic}
                      alt=""
                      height={28}
                      width={28}
                      className="h-7 w-7 rounded-full object-fill"
                    />
                  )}
                  <h1 className="ml-3 text-base text-gray-500">{u.name}</h1>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <div className="flex flex-col items-center lg:p-5"> */}
        {userPosts.length > 0 ? (
          userPosts?.map((post: { user: User; posts: Post }, i) => (
            <Post user={post.user} post={post.posts} key={i} />
          ))
        ) : (
          <h1 className="mt-5 text-center text-lg font-bold ">
            No posts to show
          </h1>
        )}
      </div>
      _
    </div>
  );
}

export default UserProfile;
