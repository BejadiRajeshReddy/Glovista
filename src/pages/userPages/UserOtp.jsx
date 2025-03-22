import { Button, Card } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resendOtp, verifyOtp } from "../../services/userApiServices";
import Loader from "../../components/common/Loader";
import { showToast } from "../../components/utils/toast";

function UserOtp() {
  const { state } = useLocation();
  const userEmail = state?.email;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: userEmail,
    otp_code: "",
  });
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(300);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const cooldownTimer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(cooldownTimer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear field-specific errors
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const resendMailOtp = async () => {
    setLoading(true);
    try {
      setTimeLeft(300);
      setResendCooldown(30);
      const response = await resendOtp(formData.email);
      setLoading(false);
      showToast(
        "success",
        "OTP Resended Successfully ! Check your mail and verify"
      );
      console.log(
        response,
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
      );
    } catch (error) {
      console.log("An Error Occured Resending", error.message);
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp(formData.email, formData.otp_code);
      showToast("success", response.message || "Email Verified Successfully");
      setLoading(false);
      navigate("/login"); // Redirect on success
      setErrors({}); // Clear previous errors
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setLoading(false);
      if (error?.otp_code) {
        // Set specific field errors from the backend
        setErrors({ otp_code: error.otp_code });
      } else {
        // Handle other cases (e.g., network issues, unexpected errors)
        showToast("error", "Failed to verify OTP. Please try again.");
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-[#33ccff] to-[#ff99cc] p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="flex items-center justify-center mt-3">
          <h5 className="justify-center font-bold text-center py-4 text-xl text-black">
            Glovista
          </h5>
        </div>
        <h5 className="justify-center font-bold text-center text-xl text-black">
          Please Check Your Email
        </h5>
        <h6 className="justify-center font-bold text-center py-4 text-xl text-black">
          {userEmail}
        </h6>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <input
              type="text"
              name="otp_code"
              placeholder="Enter Your 4 Digit Otp Here"
              value={formData.otp_code}
              onChange={handleChange}
              className={`w-full h-10 border-2 ${
                errors.otp_code ? "border-red-500" : "border-black"
              } placeholder:text-black placeholder:text-center rounded-md`}
            />
            {errors.otp_code && (
              <p className="text-red-500 text-sm mt-1">{errors.otp_code[0]}</p>
            )}
          </div>
          {loading ? (
            <Loader />
          ) : (
            <Button
              onClick={verifyEmailOtp}
              className="w-full bg-black hover:bg-black text-white font-semibold py-2 rounded-md border-2 border-black"
            >
              SUBMIT
            </Button>
          )}

          <p className="text-center text-blue-500">
            Time remaining:{" "}
            <span className="text-red-500">{formatTime(timeLeft)}</span>
          </p>

          {loading ? (
            <Loader />
          ) : (
            <p className="text-center text-blue-500">
              <Link
                onClick={resendMailOtp}
                className={`${
                  resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={resendCooldown > 0}
              >
                Resend OTP {resendCooldown > 0 && `(${resendCooldown}s)`}
              </Link>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default UserOtp;
