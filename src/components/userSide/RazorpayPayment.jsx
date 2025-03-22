import React, { useState } from "react";
import {
  createRazorPayOrder,
  verifyRazopPayPayment,
} from "../../services/RazorPayApiService";
import { useNavigate } from "react-router-dom";

const RazorpayPayment = ({
  amount,
  userData,
  subtotal,
  discount,
  delivery_fee,
  onSuccess,
  onFailure,
  address,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const paymentData = {
        total_amount: parseFloat(amount),
        subtotal: parseFloat(subtotal),
        discount: discount,
        delivery_fee: delivery_fee,
        currency: "INR",
        address,
      };

      const orderData = await createRazorPayOrder(paymentData);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Glovista",
          description: "Purchase Description",
          order_id: orderData.razorpay_order_id,
          handler: async function (response) {
            try {
              const verificationData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              };

              const verificationResult = await verifyRazopPayPayment(
                verificationData
              );
              setLoading(false);

              if (onSuccess) {
                onSuccess(verificationResult);
              }
            } catch (error) {
              setLoading(false);
              if (onFailure) {
                onFailure(error);
              }
            }
          },
          prefill: {
            name: userData.name,
            email: userData.email,
            contact: userData.phone,
          },
          notes: {
            address: userData.house_address,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              if (onFailure) {
                onFailure(new Error("Payment cancelled by user"));
              }
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      };

      script.onerror = () => {
        setLoading(false);
        if (onFailure) {
          onFailure(new Error("Failed to load Razorpay checkout"));
        }
      };
    } catch (error) {
      setLoading(false);
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full mt-6 bg-black font-sans text-white hover:bg-gray-800 px-4 py-2 rounded-md"
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayPayment;
