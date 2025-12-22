const asyncHandler = require("../../utils/asyncHandler");
const userService = require("./users.service");

exports.me = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.status(200).json(user);
});

exports.getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.status(200).json(user);
});

exports.updateMe = asyncHandler(async (req, res) => {
  const result = await userService.updateMe(req.user.id, req.body);
  res.status(200).json(result);
});
