import FriendRequestCard from "./friend-Request-Card/FriendRequestCard";

interface Props {
  user: friendRequests[];
}

const FriendRequestContainer = ({ user: u }: Props) => {
  //   const [fRequests, setFRequests] = useState<friendRequests[]>(u)
  //   const currentUser = useCurrentState((state) => state.currentUser)

  //   const { data, loading, error } = useQuery(GET_FRIEND_REQUESTS, {
  //     variables: {
  //       id: currentUser?.user?._id,
  //     },
  //   })

  //   useEffect(() => {
  //     const users: friendRequests[] = data?.userById?.user?.friendRequests
  //     setFRequests(users)
  //   }, [data])

  //   const handleRefresh = async () => {
  //     const refreshToast = toast.loading('Refreshing...')
  //     const userInfo = await getFriendRequests(currentUser?.user?._id)
  //     setFRequests(userInfo)
  //     toast.success('Friend Requests Updated', {
  //       id: refreshToast,
  //     })
  //   }

  // if (!fRequests) {
  //   return (
  //     <div className="col-span-12 lg:col-span-8 xl:col-span-6">
  //       <Loading />
  //     </div>
  //   )
  // }

  //   if (loading) {
  //     return <Loading />
  //   }

  return (
    <div className="col-span-12 flex max-h-[95vh] flex-col overflow-y-scroll border-x bg-[#010100] text-white p-5 scrollbar-hide lg:col-span-8 xl:col-span-6">
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Pending Requests{" "}
            <span className="ml-3 rounded-full bg-[#FF8080] px-2 text-white shadow-md">
              {u?.length}
            </span>
          </h1>
        </div>
        <div>
          {/* <RefreshIcon
            onClick={handleRefresh}
            className="h-8 w-8 cursor-pointer text-[#FF8080] transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          /> */}
        </div>
      </div>
      <hr className="mt-10 border bg-gray-300" />
      <div className="flex w-full flex-col px-7 py-2">
        {u?.length > 0 ? (
          u?.map((f) => <FriendRequestCard user={f} key={f._id} />)
        ) : (
          <span>No Friends Requests to show</span>
        )}
      </div>
    </div>
  );
};

export default FriendRequestContainer;
