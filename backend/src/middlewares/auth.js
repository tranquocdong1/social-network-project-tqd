const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

module.exports = (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId, role: payload.role };
    return next();
  } catch {
    return next(new ApiError(401, "TOKEN_INVALID", "Invalid or expired token"));
  }
};
