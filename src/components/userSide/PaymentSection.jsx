import { Truck } from "lucide-react";
import React from "react";

const PaymentSection = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-medium mb-6">Payment Method</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-4 w-4 text-black focus:ring-black"
          />
          <label htmlFor="cod" className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Cash on Delivery</span>
          </label>
        </div>
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <input
            type="radio"
            id="razor"
            name="paymentMethod"
            value="razor"
            checked={paymentMethod === "razor"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-4 w-4 text-black focus:ring-black"
          />
          <label htmlFor="razor" className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span> Pay with RazorPay</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
