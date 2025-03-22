import React from "react";

const ReturnPolicy = () => {
  return (
    <>
      <div className="p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          Return Policy
        </h1>
        <p className="text-base  text-black leading-relaxed mb-4">
          Dear Customers,
        </p>

        <p className="text-base text-black leading-relaxed mb-4">
          Please be informed that all products are non-returnable.
        </p>
        <p className="text-base text-black leading-relaxed mb-4">
          Refunds can be initiated under the following circumstances:
        </p>

        <ol className="list-decimal pl-6 sm:pl-8 text-base text-black leading-relaxed mb-4">
          <li>Received a damaged product.</li>
          <li>Received the wrong product.</li>
          <li>Product is used or altered.</li>
        </ol>
        <p className="text-base text-black leading-relaxed mb-4">
          Refund requests will only be accepted if initiated within 5 days post
          order delivery.
        </p>

        <p className="text-base text-black leading-relaxed mb-4">
          Thank you for your understanding and cooperation.
        </p>

        <p className="text-base text-black leading-relaxed mb-4">Click Here</p>
      </div>
    </>
  );
};

export default ReturnPolicy;
