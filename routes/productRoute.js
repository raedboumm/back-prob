const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");
const route = express.Router();

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
route.post("/",  authMiddleware,isAdmin, createProduct);
route.get("/:id", getProduct);
route.get("/", getAllProduct);
route.put("/:id",  authMiddleware, isAdmin,updateProduct);
route.delete("/:id", authMiddleware, isAdmin, deleteProduct);
module.exports = route;
