import axiosInstance from "./axiosInstance";

export const createRazorPayOrder = async (data) => {
  try {
    const response = await axiosInstance.post(`/order/razorpay_view/`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const verifyRazopPayPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post(
      `/order/verify-payment/`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};
