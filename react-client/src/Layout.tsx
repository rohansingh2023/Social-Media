import { Outlet } from "react-router-dom";
import { useCurrentState } from "./state-management/current-user";
import { lazy, useEffect } from "react";

const NavbarLazy = lazy(() => import("./components/navbar/Navbar"));

const Layout = () => {
  const { addCurrentUser, loading, error } = useCurrentState();

  useEffect(() => {
    addCurrentUser();
  }, [addCurrentUser]);

  if (loading) {
    console.log("Fetching current user data");
  }

  if (error) {
    console.log(error);
  }

  return (
    <>
      <div className="overflow-hidden">
        <NavbarLazy />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
