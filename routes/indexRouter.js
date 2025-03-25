const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");
const { getAllUsers, deleteUserByEmail } = require("../db/authQueries");

router.get("/", (req, res, next) => {
  res.send("Home");
});

// These routes are for testing only
router.get("/getAllUsers", async (req, res, next) => {
  const allUsers = await getAllUsers();
  if (allUsers) {
    res.status(200).json({ success: true, users: allUsers });
  } else {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/deleteUserByEmail", async (req, res, next) => {
  const email = req.body.email;
  const allUsers = await deleteUserByEmail(email);
  if (allUsers) {
    res.status(200).json({ success: true, users: allUsers });
  } else {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
