import { Button, Card } from "@material-tailwind/react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/userApiServices";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await resetPassword(token, email, password);
      setMessage(response.message);
      navigate("/");
    } catch (error) {
      setMessage(error.message || "An Error Occured");
    }
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
          Reset Your Password
        </h5>
        <h6 className="justify-center font-bold text-center py-4 text-xl text-black">
          {}
        </h6>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Enter Your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full h-10 border-2 border-black placeholder:text-black  rounded-md`}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Your new password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full h-10 border-2 border-black placeholder:text-black  rounded-md`}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-black hover:bg-black text-white font-semibold py-2 rounded-md border-2 border-black"
          >
            SUBMIT
          </Button>
          {message && <p className="text-center text-red-500">{message}</p>}
        </div>
      </Card>
    </div>
  );
}

export default ResetPassword;
