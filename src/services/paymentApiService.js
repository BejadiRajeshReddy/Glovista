import axiosInstance from "./axiosInstance";

export const createOrder = async (data) => {
  const response = await axiosInstance.post("order/order_cod/", data);
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get("order/all_orders/");
  return response.data;
};

export const getOrdersByUser = async () => {
  const response = await axiosInstance.get("order/order_byuser/");
  return response.data;
};

export const getOrderDetails = async (id) => {
  const response = await axiosInstance.get(`order/orders/${id}/`);
  return response.data;
};

export const updateOrderStatus = async (data) => {
  const response = await axiosInstance.patch(
    `order/orders/${data.id}/status`,
    data
  );
  return response.data;
};
