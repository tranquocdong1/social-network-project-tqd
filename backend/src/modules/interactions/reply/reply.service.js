const Comment = require("../comment.model");
const ApiError = require("../../../utils/apiError");

const MAX_DEPTH = 2; // giới hạn 2 level reply

exports.createReply = async ({ parentCommentId, userId, content }) => {
  if (!content || !content.trim()) {
    throw new ApiError(400, "INVALID_INPUT", "Reply cannot be empty");
  }

  const parent = await Comment.findById(parentCommentId);
  if (!parent || parent.status !== "active") {
    throw new ApiError(404, "COMMENT_NOT_FOUND", "Parent comment not found");
  }

  if (parent.depth >= MAX_DEPTH) {
    throw new ApiError(400, "MAX_DEPTH_REACHED", "Max reply depth reached");
  }

  const reply = await Comment.create({
    postId: parent.postId,
    authorId: userId,
    content: content.trim(),
    parentId: parent._id,
    rootId: parent.rootId || parent._id,
    depth: parent.depth + 1,
  });

  return await Comment.findById(reply._id).populate(
    "authorId",
    "fullName avatar"
  );
};

exports.getReplies = async ({ parentCommentId }) => {
  const replies = await Comment.find({
    parentId: parentCommentId,
    status: "active",
  })
    .sort({ createdAt: 1 })
    .populate("authorId", "fullName avatar");

  return replies.map((r) => ({
    id: r._id,
    content: r.content,
    depth: r.depth,
    createdAt: r.createdAt,
    author: {
      id: r.authorId._id,
      fullName: r.authorId.fullName,
      avatar: r.authorId.avatar || null,
    },
  }));
};
