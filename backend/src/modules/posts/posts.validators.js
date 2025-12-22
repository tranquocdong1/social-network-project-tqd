const { z } = require("zod");
const ApiError = require("../../utils/apiError");

const createPostSchema = z.object({
  content: z.string().max(5000).optional().default(""),
});

const updatePostSchema = z.object({
  content: z.string().max(5000).optional(),
  images: z.array(z.string().url()).max(5).optional(),
});

const listQuerySchema = z.object({
  limit: z.string().optional(),
  cursor: z.string().optional(),
});

const validateBody = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (e) {
    next(new ApiError(400, "INVALID_INPUT", e.errors?.[0]?.message || "Invalid input"));
  }
};

const validateQuery = (schema) => (req, _res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (e) {
    next(new ApiError(400, "INVALID_INPUT", e.errors?.[0]?.message || "Invalid input"));
  }
};

module.exports = {
  createPostSchema,
  updatePostSchema,
  listQuerySchema,
  validateBody,
  validateQuery,
};
