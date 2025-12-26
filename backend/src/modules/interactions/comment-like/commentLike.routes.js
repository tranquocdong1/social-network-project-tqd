const router = require("express").Router();
const auth = require("../../../middlewares/auth");
const controller = require("./commentLike.controller");

// Like / Unlike comment
router.post("/comments/:id/like", auth, controller.toggleLike);

// Check liked
router.get("/comments/:id/likes/me", auth, controller.checkLiked);

module.exports = router;
