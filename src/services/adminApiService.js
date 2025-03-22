import axiosInstance from "./axiosInstance";

export const createCategory = async (data) => {
  const response = await axiosInstance.post(
    "category/category_view/",
    data,
    {}
  );
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get("auth/user_list/");
  return response.data;
};

export const manageUserBlock = async (id, data) => {
  const response = await axiosInstance.put(`auth/user_profile/${id}/`, data);
  return response.data;
};

export const getCategory = async () => {
  const response = await axiosInstance.get("category/category_view/");
  return response.data;
};

export const adminLogin = async (email, password) => {
  const response = await axiosInstance.post("auth/token/", { email, password });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`category/categorybyid/${id}/`);
  return response.data;
};

export const updateCategory = async (categoryId, data) => {
  const response = await axiosInstance.put(
    `category/categorybyid/${categoryId}/`,
    data
  );
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await axiosInstance.get("vendor/product/");
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`vendor/product/${productId}`);
  return response.data;
};

export const createProducts = async (data) => {
  const response = await axiosInstance.post("vendor/product/", data, {});
  return response.data;
};

export const updateProduct = async (productId, data) => {
  const response = await axiosInstance.put(
    `vendor/product/${productId}/`,
    data
  );
  return response.data;
};

export const createCoupon = async (data) => {
  const response = await axiosInstance.post("offer/add_coupon/", data);
  return response.data;
};

export const getCoupon = async () => {
  const response = await axiosInstance.get("offer/coupon/");
  return response.data;
};

export const getCouponById = async (id) => {
  const response = await axiosInstance.get(`offer/coupon/${id}`);
  return response.data;
};

export const updateCoupon = async (id, data) => {
  const response = await axiosInstance.put(`offer/coupon/${id}/`, data);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await axiosInstance.delete(`offer/coupon/${id}/`);
  return response.data;
};

export const getOffers = async () => {
  const response = await axiosInstance.get("offer/offers");
  return response.data;
};

export const createOffer = async (data) => {
  const response = await axiosInstance.post("offer/add_offer/", data);
  return response.data;
};

export const getOfferById = async (id) => {
  const response = await axiosInstance.get(`offer/offerby_id/${id}/`);
  return response.data;
};

export const editOffer = async (id, data) => {
  const response = await axiosInstance.put(`offer/offerby_id/${id}/`, data);
  return response.data;
};

export const deleteOffer = async (id) => {
  const response = await axiosInstance.delete(`offer/offerby_id/${id}/`);
  return response.data;
};

export const createIngredients = async (data) => {
  const response = await axiosInstance.post("category/ingredient_view/", data);
  return response.data;
};

export const getIngredients = async () => {
  const response = await axiosInstance.get("category/ingredient_view/");
  return response.data;
};

export const deleteIngredients = async (id) => {
  const response = await axiosInstance.delete(`category/ingredientbyid/${id}/`);
  return response.data;
};

export const updateIngredients = async (categoryId, data) => {
  const response = await axiosInstance.put(
    `category/ingredientbyid/${categoryId}/`,
    data
  );
  return response.data;
};

export const createConcern = async (data) => {
  const response = await axiosInstance.post("category/concern_view/", data);
  return response.data;
};

export const getConcerns = async () => {
  const response = await axiosInstance.get("category/concern_view/");
  return response.data;
};

export const deleteConcern = async (id) => {
  const response = await axiosInstance.delete(`category/concernbyid/${id}/`);
  return response.data;
};

export const updateConcern = async (categoryId, data) => {
  const response = await axiosInstance.put(
    `category/concernbyid/${categoryId}/`,
    data
  );
  return response.data;
};



export const cancelOrderAdmin = async (order_id) => {
  const response = await axiosInstance.post(`order/shiprocket/cancel-order/`, {
    order_id,
  });
  return response.data;
};
