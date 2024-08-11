import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChatListLoading = () => {
  return (
    <div className="m-3 flex flex-1 items-center rounded-md p-2 font-Inter bg-[#191818]">
      {/* <Skeleton height={50} /> */}
      <Skeleton circle={true} height={48} width={48} />
      <div className="ml-3 flex flex-col">
        <Skeleton duration={5} height={10} width={250} />
        <Skeleton duration={5} height={10} width={250} />
      </div>
    </div>
  );
};

export default ChatListLoading;
