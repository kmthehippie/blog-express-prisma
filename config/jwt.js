const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, accessTokenSecret, {
    expiresIn: "15m",
  });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, refreshTokenSecret, {
    expiresIn: "7d",
  });
};

exports.authAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Token Required" });
  }
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Access Token" });
    }
    req.user = user;
    next();
  });
};

exports.authRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token Required" });
  }
  jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Refresh Token" });
    const newAccessToken = this.generateAccessToken({ id: user.id });
    res.json({ accessToken: newAccessToken });
  });
};
