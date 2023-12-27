const Product = require("../model/ProductModel");
const expressAsyncHandler = require("express-async-handler");
const asynchandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asynchandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});
//update product

const updateProduct = asynchandler(async (req, res) => {
  const id = req.params;
  console.log(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id.id },
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
//delete product
const deleteProduct = asynchandler(async (req, res) => {
  const id = req.params;
  console.log(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const deleteProduct = await Product.findByIdAndDelete(id.id);
    res.json({ msg: "product deleted", deleteProduct });
  } catch (error) {
    throw new Error(error);
  }
});
//get one product
const getProduct = asynchandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// get filtiring
const getAllProduct = asynchandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFileds = ["page", "sort", "limit", "fields"];
    excludeFileds.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gte|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryStr));
    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join("");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //limiting the fieleds
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error(" this page does not exists");
    }

    const product = await query;

    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
