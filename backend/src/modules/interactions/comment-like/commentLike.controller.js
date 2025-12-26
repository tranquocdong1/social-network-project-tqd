const asyncHandler = require("../../../utils/asyncHandler");
const service = require("./commentLike.service");

exports.toggleLike = asyncHandler(async (req, res) => {
  const result = await service.toggleLike({
    commentId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
});

exports.checkLiked = asyncHandler(async (req, res) => {
  const result = await service.checkLiked({
    commentId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
});
