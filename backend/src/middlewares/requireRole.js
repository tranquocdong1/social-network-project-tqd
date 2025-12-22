const ApiError = require("../utils/apiError");

module.exports = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, "UNAUTHORIZED", "Missing auth"));
  if (!roles.includes(req.user.role)) return next(new ApiError(403, "FORBIDDEN", "Insufficient permission"));
  next();
};
