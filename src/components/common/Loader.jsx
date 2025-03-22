import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-60 bg-black">
      <FadeLoader color="#0cb098" />
    </div>
  );
};
export default Loader;
