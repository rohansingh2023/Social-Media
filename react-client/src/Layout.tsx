import { Outlet } from "react-router-dom";
import { Navbar } from "./components";

const Layout = () => {
  return (
    <>
      <div className="overflow-hidden">
        {/* <header className="z-50 "> */}
        <Navbar />
        {/* </header> */}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
