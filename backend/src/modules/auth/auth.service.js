const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const ApiError = require("../../utils/apiError");

const signAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar ?? null,
  bio: user.bio ?? null,
  role: user.role,
  status: user.status,
});

exports.register = async ({ email, password, fullName }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "EMAIL_EXISTS", "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    passwordHash,
    fullName,
    role: "user",
    status: "active",
  });

  return { message: "Register success", user: sanitizeUser(user) };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");

  if (user.status !== "active") throw new ApiError(403, "ACCOUNT_DISABLED", "Account is not active");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");

  const accessToken = signAccessToken(user);

  const safeUser = await User.findById(user._id);
  return { accessToken, user: sanitizeUser(safeUser) };
};

exports.me = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  return sanitizeUser(user);
};

exports.logout = async () => {
  return { message: "Logout success" };
};
