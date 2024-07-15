const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLoginForm)

  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );

router.get("/logout", userController.logOut);
module.exports = router;
