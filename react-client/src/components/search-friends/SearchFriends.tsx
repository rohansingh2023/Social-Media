import React, { Key, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useCurrentState } from "../../state-management/current-user";
import { UserCard } from "..";
import SearchFriendsSkeleton from "./SearchFriendsSkeleton";

interface Props {
  searchUsers: SearchUsers;
  loading: boolean;
}

function SearchFriends({ searchUsers, loading }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const currentUser = useCurrentState((state) => state.currentUser);

  const onlyUserData: any[] = searchUsers?.users?.filter(
    (user: { _id: string }) => user._id !== currentUser?.user?._id
  );

  const num = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="col-span-12 bg-[#010100] text-white flex max-h-[95vh] flex-1 flex-col overflow-y-scroll scrollbar-hide lg:col-span-8 lg:border-x xl:col-span-6 ">
      <div className="ml-7 mt-5 flex h-16 w-11/12 bg-[#191818] items-start justify-center rounded-full p-5 shadow-lg">
        <AiOutlineSearch size={30} />
        <input
          placeholder="Enter friend's name"
          className="ml-3 flex flex-1 bg-[#191818] placeholder:text-white p-0.5 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="ml-11 flex w-[88%] flex-col items-center justify-center p-5">
        {loading && num.map((i) => <SearchFriendsSkeleton key={i} />)}
        {onlyUserData?.length > 0 ? (
          onlyUserData
            ?.filter((u: { name: string }) =>
              u?.name?.toLowerCase().includes(searchTerm)
            )
            .map((user: User, i: Key) => <UserCard key={i} user={user} />)
        ) : (
          <span className="mt-32 text-center text-2xl font-bold">
            No friends to show
          </span>
        )}
      </div>
      {/* )} */}
    </div>
  );
}

export default SearchFriends;
