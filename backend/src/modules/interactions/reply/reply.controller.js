const asyncHandler = require("../../../utils/asyncHandler");
const replyService = require("./reply.service");

exports.createReply = asyncHandler(async (req, res) => {
  const reply = await replyService.createReply({
    parentCommentId: req.params.id,
    userId: req.user.id,
    content: req.body.content,
  });

  res.status(201).json({
    id: reply._id,
    content: reply.content,
    createdAt: reply.createdAt,
    author: {
      id: reply.authorId._id,
      fullName: reply.authorId.fullName,
      avatar: reply.authorId.avatar || null,
    },
  });
});

exports.getReplies = asyncHandler(async (req, res) => {
  const replies = await replyService.getReplies({
    parentCommentId: req.params.id,
  });

  res.json({ items: replies });
});
