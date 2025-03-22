import axiosInstance from "./axiosInstance";

export const checkUserBlocked = async (id) => {
  const response = await axiosInstance.get(`auth/check_user/${id}`);
  return response.data;
};
