const router = require("express").Router();
const auth = require("../../middlewares/auth");
const controller = require("./interaction.controller");

// Like
router.post("/posts/:id/like", auth, controller.toggleLike);
router.get("/posts/:id/likes/me", auth, controller.checkLiked);

// Comment
router.post("/posts/:id/comments", auth, controller.createComment);
router.get("/posts/:id/comments", auth, controller.getComments);
router.delete("/comments/:id", auth, controller.deleteComment);

module.exports = router;
