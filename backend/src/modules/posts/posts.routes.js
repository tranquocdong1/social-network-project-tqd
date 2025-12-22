const router = require("express").Router();
const auth = require("../../middlewares/auth");
const controller = require("./posts.controller");
const upload = require("../../middlewares/upload");

const {
  validateBody,
  validateQuery,
  createPostSchema,
  updatePostSchema,
  listQuerySchema,
} = require("./posts.validators");

router.post("/", auth, upload.array("images", 5), validateBody(createPostSchema), controller.create);

router.get("/", auth, validateQuery(listQuerySchema), controller.feed);

router.get("/:id", auth, controller.detail);

router.get("/user/:id/posts", auth, validateQuery(listQuerySchema), controller.byUser);

router.put("/:id", auth, validateBody(updatePostSchema), controller.update);

router.delete("/:id", auth, controller.remove);

module.exports = router;
