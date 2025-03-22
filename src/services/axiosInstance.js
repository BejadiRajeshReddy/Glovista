import axios from "axios";
import Cookies from "js-cookie";
import { logoutSuccess } from "../redux/Slices/authSlices";
import { showToast } from "../components/utils/toast";

const baseUrl = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setupAxiosInterceptors = (navigate, dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error);
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          dispatch(logoutSuccess());
          navigate("/login");

          return showToast("error", error.response.data.error);
        } else if (status === 403) {
          showToast("error", "Access denied. You do not have permission.");
          return navigate("/forbidden", {
            state: { status, message: "forbidden" },
          });
        } else if (status === 404) {
          showToast("error", "Resource not found.");
          return navigate("error", {
            state: { status, message: "not-found" },
          });
        } else if (status >= 500) {
          showToast("error", "Server error. Please try again later.");
          return navigate("error", {
            state: { status, message: "forbidden" },
          });
        }
      } else {
        showToast(
          "error",
          "Unexpected error occurred. Please try again later."
        );
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
