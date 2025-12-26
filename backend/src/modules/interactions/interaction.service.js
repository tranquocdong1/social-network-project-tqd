const mongoose = require("mongoose");
const Like = require("./like.model");
const Comment = require("./comment.model");
const Post = require("../posts/post.model");
const ApiError = require("../../utils/apiError");

exports.toggleLike = async ({ postId, userId }) => {
  if (!mongoose.isValidObjectId(postId))
    throw new ApiError(400, "INVALID_INPUT", "Invalid postId");

  const post = await Post.findById(postId);
  if (!post || post.status !== "active")
    throw new ApiError(404, "POST_NOT_FOUND", "Post not found");

  const existing = await Like.findOne({ postId, userId });

  if (existing) {
    await existing.deleteOne();
    post.likeCount = Math.max(0, post.likeCount - 1);
    await post.save();
    return { liked: false, likeCount: post.likeCount };
  }

  await Like.create({ postId, userId });
  post.likeCount += 1;
  await post.save();

  return { liked: true, likeCount: post.likeCount };
};

exports.checkLiked = async ({ postId, userId }) => {
  const liked = await Like.exists({ postId, userId });
  return { liked: !!liked };
};

exports.createComment = async ({ postId, userId, content }) => {
  if (!content || !content.trim())
    throw new ApiError(400, "INVALID_INPUT", "Comment cannot be empty");

  const post = await Post.findById(postId);
  if (!post || post.status !== "active")
    throw new ApiError(404, "POST_NOT_FOUND", "Post not found");

  const comment = await Comment.create({
    postId,
    authorId: userId,
    content: content.trim(),
  });

  post.commentCount += 1;
  await post.save();

  const populated = await Comment.findById(comment._id).populate(
    "authorId",
    "fullName avatar"
  );

  return {
    id: populated._id,
    author: {
      id: populated.authorId._id,
      fullName: populated.authorId.fullName,
      avatar: populated.authorId.avatar || null,
    },
    content: populated.content,
    createdAt: populated.createdAt,
  };
};

exports.getComments = async ({ postId, limit = 10, cursor }) => {
  const query = { postId, status: "active", parentId: null };
  if (cursor) query.createdAt = { $lt: new Date(cursor) };

  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .populate("authorId", "fullName avatar")
    .select("content author createdAt likeCount");

  const items = comments.map((c) => ({
    id: c._id,
    author: {
      id: c.authorId._id,
      fullName: c.authorId.fullName,
      avatar: c.authorId.avatar || null,
    },
    content: c.content,
    createdAt: c.createdAt,
    likeCount: c.likeCount ?? 0,
  }));

  return {
    items,
    nextCursor: items.length ? items[items.length - 1].createdAt : null,
  };
};

exports.deleteComment = async ({ commentId, user }) => {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.status !== "active")
    throw new ApiError(404, "COMMENT_NOT_FOUND", "Comment not found");

  const isOwner = comment.authorId.toString() === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin)
    throw new ApiError(403, "FORBIDDEN", "Cannot delete this comment");

  comment.status = "deleted";
  await comment.save();

  await Post.findByIdAndUpdate(comment.postId, {
    $inc: { commentCount: -1 },
  });

  return { message: "Comment deleted" };
};
