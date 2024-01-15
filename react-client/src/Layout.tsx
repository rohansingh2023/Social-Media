import { Outlet } from "react-router-dom";
import { Navbar } from "./components";

const Layout = () => {
  return (
    <>
      <header className="z-50 ">
        <Navbar />
      </header>
      <Outlet />
    </>
  );
};

export default Layout;
