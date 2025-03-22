import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UnProtectedRoute = ({ children }) => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to={userInfo?.is_superuser ? "/admin/dashboard" : "/"} />;
  }

  return children;
};
