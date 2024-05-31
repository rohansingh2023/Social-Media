import { useEffect, useRef, useState } from "react";
import { GoVerified } from "react-icons/go";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { Link } from "react-router-dom";
import loginImg from "../../assets/login_img.png";
import testVideo from "../../assets/test_vid1.mp4";
import { useCurrentState } from "../../state-management/current-user";

const VideoCard = () => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentUser = useCurrentState((state) => state.currentUser);

  const onVideoPress = () => {
    if (isPlaying) {
      videoRef?.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef?.current?.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  return (
    <div className="flex flex-col border-b-2 text-white border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
          <div className="md:h-16 md:w-16 h:10 w-10">
            <Link to={`/profile/${currentUser?.user?._id}`}>
              <>
                <img
                  width={62}
                  height={62}
                  //   src={post.postedBy.image}
                  src={loginImg}
                  alt="Profile Photo"
                  className="rounded-full"
                />
              </>
            </Link>
          </div>
          <div className="lg:w-[400px] w-[200px]">
            <Link to={"/"}>
              <div className="flex items-center gap-2">
                <p className="flex items-center gap-2 md:text-md font-bold text-primary">
                  {/* {post.postedBy.userName} */}
                  Rohan
                  {` `}
                  <GoVerified className="text-blue-400 text-md" />
                </p>
                <p className="capitalize font-medium text-xs text-gray-500 hidden md:block ">
                  {/* {post.postedBy.userName} */}
                  Rohan
                </p>
              </div>
            </Link>
            <Link to={`/detail`}>
              <p className="mt-2 font-normal ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
                velit ullam odit, repellendus quos minus rem quod dolor nesciunt
                illum?
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:ml-20 flex gap-4 relative">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="rounded-3xl"
        >
          <Link to={`/detail`}>
            <video
              ref={videoRef}
              className="lg:w-[400px] w-[200px] h-[300px] md:h-[400px] lg:h-[530px] rounded-2xl cursor-pointer bg-[#191818]"
              //   src={post.video.asset.url}
              src={testVideo}
              loop
            ></video>
          </Link>
          {isHover && (
            <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[400px] p-3">
              {isPlaying ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-white text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-white text-2xl lg:text-4xl" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-white text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-white text-2xl lg:text-4xl" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
