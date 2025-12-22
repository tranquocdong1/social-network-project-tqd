const router = require("express").Router();
const controller = require("./users.controller");
const auth = require("../../middlewares/auth");
const { validate, updateMeSchema } = require("../auth/auth.validators");

router.get("/me", auth, controller.me);
router.put("/me", auth, validate(updateMeSchema), controller.updateMe);
router.get("/:id", auth, controller.getById);

module.exports = router;
