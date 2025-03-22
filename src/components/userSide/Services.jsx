import React from "react";

const Services = () => {
  return (
    <>
      <div className="flex justify-center   items-center px-28 py-12">
        <div className=" md:grid  grid-cols-2 gap-10 w-full">
          <div className="col-span-1 rounded-lg ">
            <div className=" md:m-0 m-2">
              <img src="/dummies/doc.avif" className="rounded-lg" alt="" />
            </div>
          </div>
          <div className="col-span-1  rounded-lg">
            <div className=" md:m-0 m-2">
              <img src="/dummies/doc2.avif" className="rounded-lg" alt="" />
            </div>
          </div>
          <div className="col-span-2 rounded-lg">
            <div className=" md:m-0 m-2">
              <img src="/dummies/doc3.webp" className="rounded-lg" alt="" />
            </div>
          </div>
        </div>
        <div className="bg-teal-50"></div>
      </div>
    </>
  );
};

export default Services;
