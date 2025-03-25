const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

//Setup CORS and the options
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  // If need to use dynamic origin, can use function(origin,cb)...check npm readme for cors
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//Setup Passport
app.use(passport.initialize());
require("./config/passport-setup");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is now listening at port ${process.env.PORT || 3000}`);
});
