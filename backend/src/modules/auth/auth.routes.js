const router = require("express").Router();
const controller = require("./auth.controller");
const auth = require("../../middlewares/auth");
const { validate, registerSchema, loginSchema } = require("./auth.validators");

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", auth, controller.me);
router.post("/logout", auth, controller.logout);

module.exports = router;
