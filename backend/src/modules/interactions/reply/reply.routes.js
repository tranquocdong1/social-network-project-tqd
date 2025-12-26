const router = require("express").Router();
const auth = require("../../../middlewares/auth");
const controller = require("./reply.controller");

// Reply comment
router.post("/comments/:id/replies", auth, controller.createReply);
router.get("/comments/:id/replies", auth, controller.getReplies);

module.exports = router;
