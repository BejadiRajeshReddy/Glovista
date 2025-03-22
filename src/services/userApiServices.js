import axiosInstance from "./axiosInstance";

export const postSignupData = async (data) => {
  const response = await axiosInstance.post("auth/user_register/", data);
  return response.data;
};

export const userProfileAPi = async (userId) => {
  const response = await axiosInstance.get(`auth/user_profile/${userId}/`);
  return response.data;
};

export const userProfileUpdate = async (userId, data) => {
  const response = await axiosInstance.put(
    `auth/user_profile/${userId}/`,
    data
  );
  return response.data;
};

export const sendOtp = async (phone_number) => {
  const response = await axiosInstance.post("auth/send-otp/", {
    phone_number,
  });
  return response.data;
};

export const verifyOtp = async (phone_number, otp_code) => {
  const response = await axiosInstance.post("auth/verify-otp/", {
    phone_number,
    otp_code,
  });
  return response.data;
};

export const resendOtp = async (email) => {
  const response = await axiosInstance.post("auth/resend-otp/", { email });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("auth/token/", { email, password });
  return response.data;
};

export const forgotPasswordRequest = async (email) => {
  const response = await axiosInstance.post("auth/password_reset_request/", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token, email, password) => {
  const response = await axiosInstance.post("auth/password_reset/", {
    token,
    email,
    new_password: password,
  });
  return response.data;
};

export const PostAddress = async (data) => {
  const response = await axiosInstance.post("auth/address/", data, {});
  return response.data;
};

export const AddressByUserId = async (userId) => {
  const response = await axiosInstance.get(`auth/user_address/${userId}/`);
  return response.data;
};

export const deleteAddressById = async (id) => {
  const response = await axiosInstance.delete(`auth/address/${id}/`);
  return response.data;
};

export const updateAddressById = async (id, data) => {
  const response = await axiosInstance.put(`auth/address/${id}/`, data);
  return response.data;
};

export const getCategory = async () => {
  const response = await axiosInstance.get("category/category_view/");
  return response.data;
};

export const getProducts = async () => {
  const response = await axiosInstance.get("vendor/product/");
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post("/auth/token/refresh/", {
      refresh: refreshToken,
    });

    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const addToCart = async (productId, quantity) => {
  const response = await axiosInstance.post("/vendor/cart/", {
    product_id: productId,
    quantity: quantity,
  });
  return response.data;
};

export const deleteFromCart = async (product_id) => {
  const response = await axiosInstance.delete(
    `/vendor/cart/delete/product/${product_id}/`
  );
  return response.data;
};

export const getCart = async () => {
  const response = await axiosInstance.get("/vendor/cart/");
  return response.data;
};

export const updateCart = async (id, quantity, type) => {
  if (type === "product") {
    const response = await axiosInstance.put(`/vendor/cart/`, {
      product_id: id,
      quantity: quantity,
    });
    return response.data;
  } else {
    const response = await axiosInstance.put(`/vendor/cart/`, {
      kits_combo_id: id,
      quantity: quantity,
    });
    return response.data;
  }
};

export const getWallet = async (user_id) => {
  const response = await axiosInstance.get(`/auth/wallet_by_user/${user_id}/`);
  return response.data;
};

export const getEnquiries = async (user_id) => {
  const response = await axiosInstance.get(`/auth/enquiry/`);
  return response.data;
};

export const submitEnquiry = async (data) => {
  const response = await axiosInstance.post(`/auth/enquiry/`, data);
  return response.data;
};
