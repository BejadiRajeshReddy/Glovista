import React from "react";
import { Typography } from "@material-tailwind/react";

const Slider2 = () => {
  const slogen = [
    {
      id: 1,
      title: "FREE SHIPPING | 5% OFF ON PREPAID ORDERS | COD AVAILABLE",
    },
    {
      id: 2,
      title: "FREE SHIPPING | 5% OFF ON PREPAID ORDERS | COD AVAILABLE",
    },
    {
      id: 3,
      title: "FREE SHIPPING | 5% OFF ON PREPAID ORDERS | COD AVAILABLE",
    },
    {
      id: 4,
      title: "FREE SHIPPING | 5% OFF ON PREPAID ORDERS | COD AVAILABLE",
    },
    {
      id: 5,
      title: "FREE SHIPPING | 5% OFF ON PREPAID ORDERS | COD AVAILABLE",
    },
  ];

  return (
    <div>
      <div className="w-full flex font-albert items-center bg-blue-400 overflow-hidden relative h-[4.5rem]">
        <div className="animate-slider flex gap-40 whitespace-nowrap">
          {slogen.map((title) => (
            <Typography
              className="text-center text-lg text-white "
              key={title.id}
            >
              {title.title}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider2;
