const Comment = require("../comment.model");
const CommentLike = require("./commentLike.model");
const ApiError = require("../../../utils/apiError");

exports.toggleLike = async ({ commentId, userId }) => {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.status !== "active") {
    throw new ApiError(404, "COMMENT_NOT_FOUND", "Comment not found");
  }

  const existing = await CommentLike.findOne({ commentId, userId });

  if (existing) {
    await existing.deleteOne();
    comment.likeCount = Math.max(0, comment.likeCount - 1);
    await comment.save();
    return { liked: false, likeCount: comment.likeCount };
  }

  await CommentLike.create({ commentId, userId });
  comment.likeCount += 1;
  await comment.save();

  return { liked: true, likeCount: comment.likeCount };
};

exports.checkLiked = async ({ commentId, userId }) => {
  const liked = await CommentLike.exists({ commentId, userId });
  return { liked: !!liked };
};
