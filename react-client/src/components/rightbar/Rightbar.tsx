import { FaBirthdayCake } from "react-icons/fa";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { useCurrentState } from "../../state-management/current-user";
import { useState } from "react";
import { Link } from "react-router-dom";

const Rightbar = () => {
  const currentUser = useCurrentState((state) => state.currentUser);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const incSlide = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const decSlide = () => {
    setCurrentSlide(currentSlide - 1);
  };

  return (
    // <div className="sticky top-20 h-[100vh] w-1/4">
    <div className="hidden max-h-screen bg-[#010100] text-white max-w-full overflow-y-scroll scrollbar-hide lg:col-span-2 lg:inline xl:col-span-3">
      <div className="font-Inter lg:flex lg:h-full lg:flex-shrink-0 lg:flex-col lg:items-center">
        <div
          className={`h-50 relative mx-5 my-5 w-11/12 rounded-md shadow-xl bg-gray-300 ${
            currentSlide === 0
              ? "bg-slider1"
              : currentSlide === 1
              ? "bg-slider2"
              : "bg-slider3"
          } p-3 text-white transition-opacity duration-200`}
        >
          {currentSlide < 1 && (
            <img
              onClick={incSlide}
              src="https://raw.githubusercontent.com/Ziratsu/slider-react/a44cc92f02b0e4995cc661e04c32724fc946ac59/src/Components/Slider/icons/right-arrow.svg"
              alt=""
              height={32}
              width={32}
              className="absolute right-0 top-[45%] rounded-full bg-white p-2 hover:bg-gray-400"
            />
          )}
          {currentSlide > 0 && (
            <img
              onClick={decSlide}
              src="https://raw.githubusercontent.com/Ziratsu/slider-react/a44cc92f02b0e4995cc661e04c32724fc946ac59/src/Components/Slider/icons/left-arrow.svg"
              alt=""
              height={32}
              width={32}
              className="absolute left-0 top-[45%] rounded-full bg-white p-2 hover:bg-gray-400"
            />
          )}
          {currentSlide === 0 && (
            <div className="space-y-3 p-2">
              <h1 className="text-left font-Inter text-lg font-bold">
                Welcome to SM
              </h1>
              <p className="text-left font-Inter text-base font-light">
                Your very own social media like no other. Feel free to connect
                with world and share your thoughts. Swipe to see all it's
                amazing features.
              </p>
            </div>
          )}
          {currentSlide === 1 && (
            <div className="ml-5 space-y-3 p-2">
              <h1 className="text-left font-Inter text-lg font-bold">
                Make Friends
              </h1>
              <p className="text-left font-Inter text-base font-light">
                Connect with people from all over the world through our friend
                request feature. View, react and comment on their posts freely.
              </p>
            </div>
          )}

          {currentSlide === 2 && (
            <div className="ml-5 space-y-3 p-3">
              <h1 className="text-left font-Inter text-lg font-bold">
                Make Friends
              </h1>
              <p className="text-left font-Inter text-base font-light">
                Connect with people from all over the world through our friend
                request feature. View, react and comment on their posts freely.
              </p>
            </div>
          )}
        </div>
        <div className="flex h-28 w-11/12 flex-col items-start justify-between border-y border-gray-300 py-5 px-3 font-Inter">
          <h1 className="text-lg font-medium text-gray-500">Birthdays</h1>
          <div className="mt-3 flex items-center">
            <FaBirthdayCake size={25} />
            <p className="ml-3 text-sm font-normal">
              <span className="font-bold">Rohan and 2 others</span> have
              birthday today
            </p>
          </div>
        </div>
        <div className="flex w-11/12 flex-1 flex-col items-start justify-evenly rounded-lg border-b border-gray-300 px-3 py-5 font-Inter">
          <h1 className="text-base font-medium text-gray-500">
            Friend Requests
          </h1>
          <div className="mt-3 max-h-96 w-full overflow-y-scroll">
            {
              currentUser?.user?.friendRequests?.length > 0 ? (
                currentUser?.user?.friendRequests?.map((u: friendRequests) => (
                  // user.friends?.map((u) => (
                  <Link to={`/user/${u.userId}`}>
                    <div
                      className="flex cursor-pointer items-center justify-between p-3"
                      key={u._id}
                    >
                      <div className="flex items-center justify-between">
                        {u?.profilePic && (
                          <img
                            src={u.profilePic}
                            alt=""
                            height={32}
                            width={32}
                            className="rounded-full object-cover"
                          />
                        )}
                        <p className="ml-5 text-base font-semibold">{u.name}</p>
                      </div>
                      <div>
                        <MdOutlineOnlinePrediction size={30} />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <span className=" text-center text-sm font-normal">
                  No Friend Requests to show
                </span>
              )
              // ))
            }
          </div>
        </div>
        <div className="flex w-11/12 flex-1 flex-col items-start justify-evenly rounded-lg border-gray-300 p-3 font-Inter">
          <h1 className="text-base font-medium text-gray-500">My Friends</h1>
          <div className="mt-3 max-h-96 w-full overflow-y-scroll">
            {currentUser?.user?.friends?.length > 0 ? (
              currentUser?.user?.friends?.map(
                (u: friends) => (
                  // user.friends?.map((u) => (
                  <Link to={`/user/${u.userId}`} key={u._id}>
                    <div className="flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-200">
                      <div className="flex items-center justify-between">
                        {u?.profilePic && (
                          <img
                            src={u.profilePic}
                            alt="profilePic"
                            height={40}
                            width={40}
                            className="rounded-full object-cover"
                          />
                        )}
                        <p className="ml-5 text-sm font-medium">{u.name}</p>
                      </div>
                      <div>
                        <MdOutlineOnlinePrediction size={30} />
                      </div>
                    </div>
                  </Link>
                )
                // ))
              )
            ) : (
              <span className="text-center text-sm font-normal">
                No Friends to show
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
