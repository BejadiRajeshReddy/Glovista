import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../../services/userApiServices";
import Loader from "../../components/common/Loader";
import { loginSuccess } from "../../redux/Slices/authSlices";
import { showToast } from "../../components/utils/toast";

function UserLogin() {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Only allow single digit numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus(); // Move to next box
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move back if empty
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      showToast("error", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtp(phone);
      if (response.success) {
        setOtpSent(true);
        showToast("success", "OTP sent successfully!");
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      showToast("error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const enteredOtp = otp.join("");
      const response = await verifyOtp(phone, enteredOtp);

      if (response.access_token) {
        Cookies.set("authToken", response.access_token, {
          expires: 1 / 24,
          secure: true,
          sameSite: "Strict",
        });

        Cookies.set("refreshToken", response.refresh_token, {
          expires: 15,
          secure: true,
          sameSite: "Strict",
        });

        const decodedToken = jwtDecode(response.access_token);
        const userData = {
          user_id: decodedToken.user_id,
          is_superuser: decodedToken.is_superuser,
        };

        dispatch(
          loginSuccess({ token: response.access_token, userInfo: userData })
        );
        navigate("/");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      showToast("error", "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sliderBg to-navBg p-4">
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-5 bg-white sm:p-6 p-3 rounded-md shadow-md">
        <div className="w-full md:w-1/2 h-64 md:h-auto border-b md:border-r md:border-b-0">
          <img
            src="/login.png"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex justify-center">
            <img src="/glovista_logo.svg" alt="Logo" className="h-16 my-5" />
          </div>
          <h2 className="text-center text-2xl font-bold mb-2">Login</h2>

          {otpSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="sm:w-12 sm:h-12 w-9 h-10 text-center border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-4 pt-1 pl-1">
                Please enter the 6-digit OTP sent to your phone.
              </p>
              {loading ? (
                <Loader />
              ) : (
                <div className="flex justify-center">
                  <button className="w-full md:w-5/6 bg-black text-white py-2 rounded-md">
                    Verify OTP
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full h-12 border border-gray-400 p-2 rounded-md"
              />
              <p className="text-xs text-gray-500 mb-4 pt-1 pl-1">
                Please provide your phone number for sending the OTP.
              </p>
              {loading ? (
                <Loader />
              ) : (
                <div className="flex justify-center">
                  <button className="w-full md:w-5/6 bg-black text-white py-2 rounded-md">
                    Send OTP
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
