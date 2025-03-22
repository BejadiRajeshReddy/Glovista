import { Button, Card } from "@material-tailwind/react";
import React, { useState } from "react";
import { CardContent } from "@mui/material";
import { postSignupData } from "../../services/userApiServices";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { showToast } from "../../components/utils/toast";

function UserSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await postSignupData(formData);
      showToast("success", "User registered successfully!");
      setLoading(false);
      navigate("/otp", { state: { email: formData.email } });
      setFormData({ username: "", email: "", phone_number: "", password: "" });
      setErrors({});
    } catch (error) {
      setLoading(false);
      if (error && typeof error === "object") {
        setErrors(error);
      } else {
        showToast("error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sliderBg to-navBg  p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="flex items-center justify-center py-4 mt-5">
          <img
            src="glovista_logo.svg"
            alt=""
            className="justify-center w-40 font-bold text-center  text-black"
          />
        </div>
        <h5 className="justify-center font-bold text-center  text-xl text-black">
          Signup
        </h5>

        <CardContent>
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-10 p-2 border-2 border-black placeholder:text-black rounded-md"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username}</p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 p-2 border-2 border-black   placeholder:text-black rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email[0]}</p>}

            <input
              type="tel"
              placeholder="Enter phone Number"
              value={formData.phone_number}
              name="phone_number"
              onChange={handleChange}
              className="w-full h-10 p-2 border-2 border-black   placeholder:text-black rounded-md"
            />
            {errors.phone_number && (
              <p className="text-red-500">{errors.phone_number[0]}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-10 p-2 border-2 border-black   placeholder:text-black rounded-md"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password[0]}</p>
            )}

            {loading ? (
              <Loader />
            ) : (
              <Button
                onClick={handleSubmit}
                className="w-full bg-black  hover:bg-black  text-white font-semibold py-2 rounded-md border-2 border-black"
              >
                SUBMIT
              </Button>
            )}
            <p className="text-center text-[#2a1775]">Already Have Account ?</p>
            <p className="text-center text-[#2a1775] text-l">
              <Link to={"/login"}>Login</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default UserSignup;
