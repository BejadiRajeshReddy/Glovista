import  { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "./services/userApiServices";
import Cookies from "js-cookie";
import Loader from "./components/common/Loader";
import ScrollToTop from "./components/common/ScrollToTop";
import { logoutSuccess } from "./redux/Slices/authSlices";
import ErrorPage from "./components/ErrorPage";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/common/MotionLayout";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/*"
          element={
            <PageWrapper>
              <UserRoutes />
            </PageWrapper>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PageWrapper>
              <AdminRoutes />
            </PageWrapper>
          }
        />
        <Route
          path="/error"
          element={
            <PageWrapper>
              <ErrorPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        const accessToken = Cookies.get("authToken");
        const refreshToken = Cookies.get("refreshToken");
        setIsTokenRefreshing(true);

        if (!accessToken && refreshToken) {
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            Cookies.set("authToken", newToken, {
              expires: 1 / 24,
              secure: true,
              sameSite: "Strict",
            });
          } else {
            dispatch(logoutSuccess());
          }
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        dispatch(logoutSuccess());
      } finally {
        setIsTokenRefreshing(false);
      }
    };

    checkAndRefreshToken();
  }, [dispatch]);

  if (isTokenRefreshing) return <Loader />;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
