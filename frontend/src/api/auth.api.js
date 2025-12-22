import axiosClient from "./axiosClient";

export const registerApi = (data) =>
  axiosClient.post("/auth/register", data);

export const loginApi = (data) =>
  axiosClient.post("/auth/login", data);

export const getMeApi = () =>
  axiosClient.get("/auth/me");

export const logoutApi = () =>
  axiosClient.post("/auth/logout");
