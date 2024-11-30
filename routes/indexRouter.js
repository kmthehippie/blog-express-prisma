const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", (req, res, next) => {
  res.send("Home");
});

module.exports = router;
