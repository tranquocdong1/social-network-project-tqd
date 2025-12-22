const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

exports.me = asyncHandler(async (req, res) => {
  const result = await authService.me(req.user.id);
  res.status(200).json(result);
});

exports.logout = asyncHandler(async (req, res) => {
  const result = await authService.logout();
  res.status(200).json(result);
});
