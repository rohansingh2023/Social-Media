import { Leftbar, Rightbar, VideoCard } from "../../components";

const Video = () => {
  const array = [1, 2, 3, 4, 5];
  return (
    <div className="bg-[#010100] font-Segoe">
      <div className="grid grid-cols-12 h-screen ">
        <Leftbar />
        {/* VideoCard */}
        <div className="col-span-12 max-h-[91vh] overflow-y-scroll bg-[#010100] text-white p-3 scrollbar-hide lg:col-span-8 lg:border-x lg:p-5 xl:col-span-6">
          {array?.map((i) => (
            <VideoCard key={i} />
          ))}
        </div>
        <Rightbar />
      </div>
    </div>
  );
};

export default Video;
