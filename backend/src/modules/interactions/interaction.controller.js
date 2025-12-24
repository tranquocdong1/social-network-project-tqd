const asyncHandler = require("../../utils/asyncHandler");
const service = require("./interaction.service");

exports.toggleLike = asyncHandler(async (req, res) => {
  const result = await service.toggleLike({
    postId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
});

exports.checkLiked = asyncHandler(async (req, res) => {
  const result = await service.checkLiked({
    postId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
});

exports.createComment = asyncHandler(async (req, res) => {
  const result = await service.createComment({
    postId: req.params.id,
    userId: req.user.id,
    content: req.body.content,
  });
  res.status(201).json(result);
});

exports.getComments = asyncHandler(async (req, res) => {
  const result = await service.getComments({
    postId: req.params.id,
    limit: req.query.limit,
    cursor: req.query.cursor,
  });
  res.json(result);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const result = await service.deleteComment({
    commentId: req.params.id,
    user: req.user,
  });
  res.json(result);
});
