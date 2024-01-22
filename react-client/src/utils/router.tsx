import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  // Navigate,
} from "react-router-dom";
import Layout from "../Layout";
import { FriendRequest, Home, Login, Profile, Search, User } from "../pages";
import Cookies from "js-cookie";

const cookie = Cookies.get("userJwt");

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={cookie ? <Layout /> : <Login />}>
      <Route path="" element={<Home />} />
      <Route path="search" element={<Search />} />
      <Route path="friendRequest" element={<FriendRequest />} />
      <Route path="profile/:id" element={<Profile />} />
      <Route path="user/:id" element={<User />} />
      {/* <Route path="login" element={<Login />} /> */}
    </Route>
  )
);
