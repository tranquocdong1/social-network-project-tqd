const { z } = require("zod");
const ApiError = require("../../utils/apiError");

const registerSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8).regex(/[A-Z]/, "Need 1 uppercase").regex(/[0-9]/, "Need 1 number"),
  fullName: z.string().min(2).max(50).trim(),
});

const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1),
});

const updateMeSchema = z.object({
  fullName: z.string().min(2).max(50).trim().optional(),
  bio: z.string().max(160).trim().nullable().optional(),
  avatar: z.string().url().nullable().optional(),
});

const validate = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (e) {
    return next(new ApiError(400, "INVALID_INPUT", e.errors?.[0]?.message || "Invalid input"));
  }
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateMeSchema,
};
