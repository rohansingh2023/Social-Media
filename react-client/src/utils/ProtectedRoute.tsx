import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);

  if (token) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
