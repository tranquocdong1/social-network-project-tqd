const asyncHandler = require("../../utils/asyncHandler");
const postsService = require("./posts.service");

exports.create = asyncHandler(async (req, res) => {
  // upload middleware set req.files
  const imageUrls = (req.files || []).map((f) => f.fileUrl);
  const post = await postsService.createPost({
    userId: req.user.id,
    content: req.body.content,
    imageUrls,
  });
  res.status(201).json(post);
});

exports.feed = asyncHandler(async (req, res) => {
  const { limit, cursor } = req.query;
  const result = await postsService.getFeed({ limit, cursor });
  res.status(200).json(result);
});

exports.detail = asyncHandler(async (req, res) => {
  const post = await postsService.getPostById(req.params.id);
  res.status(200).json(post);
});

exports.byUser = asyncHandler(async (req, res) => {
  const { limit, cursor } = req.query;
  const result = await postsService.getPostsByUser({
    userId: req.params.id,
    limit,
    cursor,
  });
  res.status(200).json(result);
});

exports.update = asyncHandler(async (req, res) => {
  const imageUrls = Array.isArray(req.body.images) ? req.body.images : undefined; // update bằng URL (Phase 1)
  const result = await postsService.updatePost({
    postId: req.params.id,
    user: req.user,
    content: req.body.content,
    imageUrls,
  });
  res.status(200).json(result);
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await postsService.deletePost({
    postId: req.params.id,
    user: req.user,
  });
  res.status(200).json(result);
});
