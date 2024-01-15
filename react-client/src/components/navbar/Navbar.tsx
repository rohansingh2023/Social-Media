import { useState } from "react";
import { FaHome, FaSearch, FaFortAwesomeAlt, FaListUl } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdMessage } from "react-icons/md";
import toast from "react-hot-toast";
import { IoIosPersonAdd } from "react-icons/io";
import { useCurrentState } from "../../state-management/current-user";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../graphql/mutations/userMutations";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false)
  const router = useNavigate();
  const [colour, setColour] = useState("home");
  const currentUser = useCurrentState((state) => state.currentUser);
  const [logout] = useMutation(LOGOUT);

  const handleLogout = async () => {
    const refreshId = toast.loading("Logging Out");
    try {
      await logout();
      Cookies.remove("userJwt");
      toast.success("Logged out successfully", {
        id: refreshId,
      });
      // socket.disconnect()
      router("/auth/login");
    } catch (error) {
      console.log(error);
      toast.error("Can't Logout", {
        id: refreshId,
      });
    }
  };

  // const joinChat = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
  //   socket.emit('join_chat', { userId: currentUser?.user?._id })
  // }

  return (
    <>
      <div className="fixed left-0 top-0 z-50 grid w-screen grid-cols-12 items-center justify-between border-b-2 bg-white py-2 px-2 font-DMSerif text-white lg:px-5">
        <div className="col-span-6 flex flex-1 items-start justify-start lg:col-span-3 lg:items-center lg:justify-around">
          <Link to={"/"}>
            <img
              src="https://cdn.dribbble.com/users/24078/screenshots/15522433/media/e92e58ec9d338a234945ae3d3ffd5be3.jpg?compress=1&resize=400x300"
              alt=""
              height={40}
              width={40}
              className="h-10 w-10 rounded-full"
            />
            {/* <p className="cursor-pointer text-3xl font-bold italic">
              Social Media
            </p> */}
          </Link>
          <input
            placeholder="Search Posts"
            // className="lg:w-200 hidden lg:ml-5 lg:flex lg:flex-1 lg:rounded-lg lg:border-0 lg:bg-slate-200  lg:p-2 lg:text-black lg:placeholder-slate-400 lg:outline-none"
            className="w-200 ml-1 flex flex-1 rounded-lg border-0 bg-slate-200 p-2  text-black placeholder-slate-400 outline-none lg:ml-5"
          />
        </div>
        <div className="hidden flex-1 items-center justify-center lg:col-span-7 lg:inline-flex">
          <Link to={"/"}>
            <button onClick={() => setColour("home")}>
              <FaHome
                className="mr-20"
                size={35}
                color={colour == "home" ? "#FF8080" : "#c30f0f11"}
              />
            </button>
          </Link>
          <Link to={"/search"}>
            <button onClick={() => setColour("search")}>
              <FaSearch
                className="mr-20"
                size={30}
                color={colour == "search" ? "#FF8080" : "#c30f0f11"}
              />
            </button>
          </Link>
          <Link to={"/friendRequest"}>
            <button onClick={() => setColour("friendReq")}>
              <IoIosPersonAdd
                className="mr-20"
                size={35}
                color={colour == "friendReq" ? "#FF8080" : "#c30f0f11"}
              />
            </button>
          </Link>
          <Link to={`/profile/${currentUser?.user?._id}`}>
            <button onClick={() => setColour("profile")}>
              <FaFortAwesomeAlt
                className="mr-20"
                size={35}
                color={colour == "profile" ? "#FF8080" : "#c30f0f11"}
              />
            </button>
          </Link>
        </div>
        <div className="col-span-6 mr-0 flex flex-1 items-center justify-end lg:col-span-2 lg:mr-10 lg:justify-between">
          {/* <div className="flex items-center"> */}
          {currentUser?.user?.profilePic && (
            <img
              src={currentUser?.user?.profilePic}
              alt=""
              height={40}
              width={40}
              className="mr-5 h-10 w-10 rounded-full bg-gray-400 object-cover lg:mr-0"
            />
          )}
          <Link to={`/chat/${currentUser?.user?._id}`}>
            <MdMessage
              color="#111"
              size={45}
              className="hidden rounded-full bg-gray-300 p-3 hover:bg-gray-400 lg:inline"
              // onClick={joinChat}
            />
          </Link>
          {/* <Link to={`/auth/login`}> */}
          <RiLogoutBoxLine
            className="hidden rounded-full bg-gray-300 p-3 hover:bg-gray-400 lg:inline"
            size={45}
            onClick={handleLogout}
            color="#111"
          />
          {/* </Link> */}
          {/* </div> */}
          <FaListUl
            size={45}
            className="rounded-full bg-gray-300 p-3 hover:bg-gray-400 lg:hidden"
            color="#FF8080"
            // onClick={() => setIsOpen(true)}
          />
        </div>
        {/* {isOpen && (
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            logout={handleLogout}
          />
        )} */}
      </div>
    </>
  );
};

export default Navbar;
