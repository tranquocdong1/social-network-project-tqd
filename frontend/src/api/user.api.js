import axiosClient from "./axiosClient";

export const updateProfileApi = (data) =>
  axiosClient.put("/users/me", data);

export const getUserByIdApi = (id) =>
  axiosClient.get(`/users/${id}`);
