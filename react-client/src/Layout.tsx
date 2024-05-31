import { Outlet } from "react-router-dom";
import { useCurrentState } from "./state-management/current-user";
import { lazy, useEffect } from "react";

const NavbarLazy = lazy(() => import("./components/navbar/Navbar"));

const Layout = () => {
  const addCurrentUser = useCurrentState((state) => state.addCurrentUser);

  useEffect(() => {
    addCurrentUser();
  }, [addCurrentUser]);

  return (
    <>
      <div className="overflow-hidden">
        {/* <header className="z-50 "> */}
        <NavbarLazy />
        {/* </header> */}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
