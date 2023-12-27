const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5d" });
};
module.exports = generateRefreshToken;
