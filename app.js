const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const indexRouter = require("./routes/indexRouter");

app.use("/", indexRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is now listening at port ${process.env.PORT || 3000}`);
});
