import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import Loader from "../../components/common/Loader";
import { loginSuccess } from "../../redux/Slices/authSlices";
import { showToast } from "../../components/utils/toast";
import { adminLogin } from "../../services/adminApiService";

function AdminLogin() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminLogin(formData.email, formData.password);

      if (response.access && response.refresh) {
        Cookies.set("authToken", response.access, {
          expires: 1 / 24,
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("refreshToken", response.refresh, {
          expires: 15,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        throw new Error("Invalid login response");
      }

      const decodedToken = jwtDecode(response.access);
      const userData = {
        user_id: decodedToken.user_id,
        is_superuser: response.is_superuser,
      };

      dispatch(loginSuccess({ token: response.access, userInfo: userData }));

      if (userData.is_superuser) {
        setTimeout(() => navigate("/admin/dashboard"), 0);
      } else {
        setTimeout(() => navigate("/"), 0);
      }
    } catch (error) {
      showToast("error", "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sliderBg to-navBg p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            autoComplete="username"
          />
          <input
            autoComplete="current-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
          {loading ? (
            <Loader />
          ) : (
            <button className="w-full bg-black text-white py-2 rounded-md">
              Login
            </button>
          )}
        </form>
        <div className="text-center mt-4">
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>
          <Link to="/forgot_password" className="text-blue-500">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
