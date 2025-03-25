const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("../config/jwt");
const authController = require("../controllers/authController");

router.post("/register", authController.PostRegister);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    const user = req.user;
    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, accessToken });
  }
);

router.post("/google");

router.get("/profile", jwt.authAccessToken, authController.GetProfile);

router.post("/refreshToken", jwt.authRefreshToken);

module.exports = router;
