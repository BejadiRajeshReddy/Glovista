import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/Slices/authSlices";
import { checkUserBlocked } from "../../services/authApiService";
import { showToast } from "../../components/utils/toast";

export const UserProtectedRoute = ({ children }) => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isBlocked, setIsBlocked] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserStatus = async () => {
      try {
        const response = await checkUserBlocked(userInfo.user_id);

        if (!response.is_active) {
          dispatch(logoutSuccess());
          setIsBlocked(true);
          showToast("error", "User blocked by Administrator");
          return navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user block status:", error);
      }
    };

    if (isLoggedIn && userInfo) {
      verifyUserStatus();
    }
  }, [isLoggedIn, userInfo, dispatch]);

  if (!isLoggedIn || userInfo?.is_superuser || isBlocked) {
    return <Navigate to="/login" />;
  }

  return children;
};
