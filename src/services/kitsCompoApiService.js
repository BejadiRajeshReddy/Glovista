import axiosInstance from "./axiosInstance";

export const getKitsCompo = async () => {
  const response = await axiosInstance.get(`/vendor/kits_combo/`);
  return response.data;
};

export const getKitById = async (id) => {
  const response = await axiosInstance.get(`/vendor/kits_combo/${id}/`);
  return response.data;
};

export const createKit = async (kitData) => {
  const response = await axiosInstance.post(`/vendor/kits_combo/`, kitData);
  return response.data;
};

export const updateKit = async (id, kitData) => {
  const response = await axiosInstance.put(
    `/vendor/kits_combo/${id}/`,
    kitData
  );
  return response.data;
};

export const deleteKit = async (id) => {
  const response = await axiosInstance.delete(`/vendor/kits_combo/${id}/`);
  return response.data;
};

export const addKitToCart = async (kitId, quantity) => {
  const response = await axiosInstance.post("/vendor/cart/", {
    kits_combo_id: kitId,
    quantity: quantity,
  });
  return response.data;
};

export const deleteKitFromCart = async (product_id) => {
  const response = await axiosInstance.delete(
    `/vendor/cart/delete/kitscombo/${product_id}/`
  );
  return response.data;
};
