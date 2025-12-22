const User = require("./user.model");
const ApiError = require("../../utils/apiError");

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar ?? null,
  bio: user.bio ?? null,
  role: user.role,
  status: user.status,
});

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  return sanitizeUser(user);
};

exports.getById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  return sanitizeUser(user);
};

exports.updateMe = async (userId, payload) => {
  const allowed = {};
  if (typeof payload.fullName === "string") allowed.fullName = payload.fullName;
  if (typeof payload.bio === "string" || payload.bio === null) allowed.bio = payload.bio;
  if (typeof payload.avatar === "string" || payload.avatar === null) allowed.avatar = payload.avatar;

  const user = await User.findByIdAndUpdate(userId, allowed, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  return { message: "Profile updated", user: sanitizeUser(user) };
};
