import axiosClient from "./axiosClient";

// LIKE
export const toggleLikeApi = (postId) =>
  axiosClient.post(`/posts/${postId}/like`);

export const checkLikedApi = (postId) =>
  axiosClient.get(`/posts/${postId}/likes/me`);

// COMMENT
export const createCommentApi = (postId, payload) =>
  axiosClient.post(`/posts/${postId}/comments`, payload);

export const getCommentsApi = (postId, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return axiosClient.get(`/posts/${postId}/comments?${qs}`);
};

export const deleteCommentApi = (commentId) =>
  axiosClient.delete(`/comments/${commentId}`);

// REPLY COMMENT 
export const getRepliesApi = (commentId) =>
  axiosClient.get(`/comments/${commentId}/replies`);

export const createReplyApi = (commentId, payload) =>
  axiosClient.post(`/comments/${commentId}/replies`, payload);

// LIKE COMMENT

export const toggleCommentLikeApi = (commentId) =>
  axiosClient.post(`/comments/${commentId}/like`);

export const checkCommentLikedApi = (commentId) =>
  axiosClient.get(`/comments/${commentId}/likes/me`);


