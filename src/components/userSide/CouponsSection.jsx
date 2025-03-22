import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { showToast } from "../utils/toast";

const CouponsSection = ({
  availableCoupons,
  appliedCoupon,
  handleApplyCoupon,
}) => {
  const [couponInput, setCouponInput] = useState("");

  const handleManualCouponApply = () => {
    const foundCoupon = availableCoupons.find(
      (coupon) => coupon.coupon_code.toLowerCase() === couponInput.toLowerCase()
    );

    if (foundCoupon) {
      handleApplyCoupon(foundCoupon);
    } else {
      showToast("error", "No such Coupon available");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="space-y-4">
        <h2 className="text-xl font-medium mb-6">Coupons</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hidescroll">
          {availableCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="border border-gray-400 px-3 py-4 rounded-md min-w-[200px] flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium px-2 py-1 rounded-md text-black border bg-gray-300">
                  {coupon.coupon_code}
                </p>
                <button
                  onClick={() => handleApplyCoupon(coupon)}
                  disabled={appliedCoupon}
                  className={`text-sm p-2 rounded-md ${
                    appliedCoupon
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-green-500 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  Apply
                </button>
              </div>
              <div className="text-sm mt-2">
                Save {coupon.discount_value}{" "}
                {coupon.discount_type === "percentage" ? "%" : "amount"}
              </div>
            </div>
          ))}

          {/* Manual Coupon Entry */}
          <div className="border border-gray-400 p-3 rounded-md min-w-[200px] flex-shrink-0">
            <p className="font-medium py-1 text-black">Enter coupon code</p>
            <div className="flex gap-2">
              <Input
                size="md"
                label="Coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                onClick={handleManualCouponApply}
                className="bg-transparent text-sm border text-green-500 hover:text-green-700 p-2 rounded-md hover:bg-green-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponsSection;
