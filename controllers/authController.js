const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const {
  getEmailExist,
  createLocalUser,
  getUserIdExist,
} = require("../db/authQueries");
const generatePw = require("../config/password-utils").generatePw;
require("dotenv").config();

exports.PostRegister = [
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("name")
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a valid name"),
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Passwords must be at least 6 characters long."),
  body("role").trim(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors);
      return res.status(400).json({
        success: false,
        errors: errors,
      });
    }
    try {
      const { email, name, password, role } = req.body;
      const existing = await getEmailExist(email);
      if (existing) {
        throw new Error("Email Exists");
      } else {
        const hashedPW = await generatePw(password);
        const data = {
          email,
          name,
          password: hashedPW,
          role: role,
        };

        const result = await createLocalUser(data);
        if (result) {
          res
            .status(201)
            .json({ success: true, message: `Account created ${result.id}` });
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
      console.error("Error registering in controller: ", err);
    }
  }),
];

exports.GetProfile = asyncHandler(async (req, res, next) => {
  const userDetails = await getUserIdExist(req.user.id);
  const data = {
    id: userDetails.id,
    name: userDetails.name,
    email: userDetails.email,
    role: userDetails.role,
  };
  res.status(200).json({ success: true, user: data });
});
