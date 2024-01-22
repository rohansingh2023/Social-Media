import { useQuery } from "@apollo/client";
import { Leftbar, Rightbar, SearchFriends } from "../../components";
import { SEARCH_USERS } from "../../graphql/queries/userQueries";

const Search = () => {
  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: {
      searchTerm: "",
    },
  });

  console.log(data?.searchUsers);

  return (
    <div className="grid-rows-10 grid max-h-screen overflow-hidden font-DMSerif">
      {/* <header className="z-50 row-span-1">
        <Navbar />
      </header> */}
      <div className="row-span-10 grid grid-cols-12">
        <Leftbar />
        <SearchFriends searchUsers={data?.searchUsers} loading={loading} />
        <Rightbar />
      </div>
    </div>
  );
};

export default Search;
