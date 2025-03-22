import { Button, Card } from "@material-tailwind/react";
import React, { useState } from "react";
import { forgotPasswordRequest } from "../../services/userApiServices";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPasswordRequest(email);
      setMessage(response.message);
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
          Forgot Password
        </h5>
        <h6 className="justify-center font-bold text-center py-4 text-xl text-black">
          {}
        </h6>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <input
              type="text"
              name="email"
              placeholder="Enter Your Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full h-10 border-2 border-black placeholder:text-black rounded-md`}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-black hover:bg-black text-white font-semibold py-2 rounded-md border-2 border-black"
          >
            SUBMIT
          </Button>
          {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
      </Card>
    </div>
  );
}

export default ForgotPassword;
