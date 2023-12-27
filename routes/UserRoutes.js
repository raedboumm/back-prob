const express = require("express");
const route = express.Router();
const User = require("../model/UserSchema");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockedUser,
  unblockedUser,
  handleRefreshToken,
  logout,
} = require("../controllers/UserControllers");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

route.post("/register", createUser);
route.post("/login", loginUserCtrl);
route.get("/all-users", getallUser);
route.get("/refresh", handleRefreshToken);
route.get("/logout", logout);
route.get("/:id", authMiddleware, isAdmin, getaUser);

route.delete("/:id", deleteaUser);
route.put("/edit-user", authMiddleware, updateaUser);
route.put("/blocked-user/:id", authMiddleware, isAdmin, blockedUser);
route.put("/unblocked-user/:id", authMiddleware, isAdmin, unblockedUser);

module.exports = route;
