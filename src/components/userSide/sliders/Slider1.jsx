import React from "react";

const Slider1 = () => {
  return (
    <div className="w-full bg-blue-400 rounded-md mt-[1px] overflow-hidden font-albert relative h-10 flex items-center justify-center">
      <div className="whitespace-nowrap animate-slide-left-dormant">
        <span className="inline-block mb-2 text-white text-xs tracking-widest font-bold uppercase">
          Due to high demand, your order might take a little extra time to
          arrive. Thank you for your understanding and support.
        </span>
      </div>
    </div>
  );
};

export default Slider1;
