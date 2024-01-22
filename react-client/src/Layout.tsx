import { Outlet } from "react-router-dom";
import { Navbar } from "./components";
import { useCurrentState } from "./state-management/current-user";
import { useEffect } from "react";

const Layout = () => {
  const addCurrentUser = useCurrentState((state) => state.addCurrentUser);

  useEffect(() => {
    addCurrentUser();
  }, [addCurrentUser]);

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
