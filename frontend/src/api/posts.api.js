import axiosClient from "./axiosClient";

export const createPostApi = (formData) =>
  axiosClient.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getFeedApi = ({ limit = 10, cursor } = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  return axiosClient.get(`/posts?${params.toString()}`);
};

export const getPostDetailApi = (id) => axiosClient.get(`/posts/${id}`);

export const updatePostApi = (id, payload) => axiosClient.put(`/posts/${id}`, payload);

export const deletePostApi = (id) => axiosClient.delete(`/posts/${id}`);
