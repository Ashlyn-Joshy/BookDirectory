const express = require("express");
const router = express.Router();

const { signupInfo } = require("../middleware/user");

const wrapAsync = require("../errorhandling/wrapAsync");

const userController = require("../controllers/user");

//routes for the user singup , singin and logout
router
  .route("/signup")
  .get(userController.signupform)
  .post(signupInfo, wrapAsync(userController.signup));

router
  .route("/signin")
  .get(userController.signinform)
  .post(userController.signin);

router.get("/logout", userController.logout);

module.exports = router;
