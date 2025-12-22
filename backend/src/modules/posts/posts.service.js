const mongoose = require("mongoose");
const Post = require("./post.model");
const ApiError = require("../../utils/apiError");

const sanitizePost = (post) => ({
  id: post._id.toString(),
  author: post.authorId && post.authorId._id
    ? {
        id: post.authorId._id.toString(),
        fullName: post.authorId.fullName,
        avatar: post.authorId.avatar ?? null,
      }
    : undefined,
  authorId: post.authorId && post.authorId._id ? post.authorId._id.toString() : post.authorId.toString(),
  content: post.content,
  images: post.images || [],
  visibility: post.visibility,
  status: post.status,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const buildCursorQuery = (cursor) => {
  if (!cursor) return {};
  const d = new Date(cursor);
  if (Number.isNaN(d.getTime())) throw new ApiError(400, "INVALID_INPUT", "Invalid cursor");
  return { createdAt: { $lt: d } };
};

exports.createPost = async ({ userId, content, imageUrls }) => {
  const text = (content || "").trim();
  const images = imageUrls || [];

  if (!text && images.length === 0) {
    throw new ApiError(400, "INVALID_INPUT", "Post content cannot be empty");
  }

  const post = await Post.create({
    authorId: userId,
    content: text,
    images,
    visibility: "public",
    status: "active",
  });

  const populated = await Post.findById(post._id).populate("authorId", "fullName avatar");
  return sanitizePost(populated);
};

exports.getFeed = async ({ limit = 10, cursor }) => {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const query = {
    status: "active",
    ...buildCursorQuery(cursor),
  };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .populate("authorId", "fullName avatar");

  const items = posts.map(sanitizePost);
  const nextCursor = items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null;

  return { items, nextCursor };
};

exports.getPostById = async (postId) => {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, "INVALID_INPUT", "Invalid post id");

  const post = await Post.findById(postId).populate("authorId", "fullName avatar");
  if (!post || post.status !== "active") throw new ApiError(404, "POST_NOT_FOUND", "Post not found");

  return sanitizePost(post);
};

exports.getPostsByUser = async ({ userId, limit = 10, cursor }) => {
  if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "INVALID_INPUT", "Invalid user id");
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  const query = {
    status: "active",
    authorId: userId,
    ...buildCursorQuery(cursor),
  };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .populate("authorId", "fullName avatar");

  const items = posts.map(sanitizePost);
  const nextCursor = items.length > 0 ? items[items.length - 1].createdAt.toISOString() : null;

  return { items, nextCursor };
};

exports.updatePost = async ({ postId, user, content, imageUrls }) => {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, "INVALID_INPUT", "Invalid post id");

  const post = await Post.findById(postId);
  if (!post || post.status !== "active") throw new ApiError(404, "POST_NOT_FOUND", "Post not found");

  const isOwner = post.authorId.toString() === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "FORBIDDEN", "You cannot edit this post");

  const text = typeof content === "string" ? content.trim() : post.content;
  const images = Array.isArray(imageUrls) ? imageUrls : post.images;

  if (!text && (!images || images.length === 0)) {
    throw new ApiError(400, "INVALID_INPUT", "Post content cannot be empty");
  }

  post.content = text;
  post.images = images;
  await post.save();

  const populated = await Post.findById(post._id).populate("authorId", "fullName avatar");
  return { message: "Post updated", post: sanitizePost(populated) };
};

exports.deletePost = async ({ postId, user }) => {
  if (!mongoose.isValidObjectId(postId)) throw new ApiError(400, "INVALID_INPUT", "Invalid post id");

  const post = await Post.findById(postId);
  if (!post || post.status !== "active") throw new ApiError(404, "POST_NOT_FOUND", "Post not found");

  const isOwner = post.authorId.toString() === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "FORBIDDEN", "You cannot delete this post");

  post.status = "deleted";
  await post.save();

  return { message: "Post deleted" };
};
