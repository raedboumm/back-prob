const User = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const asynchandler = require("express-async-handler");
const generateToken = require("../config/jwt");
const validateMongoDbId = require("../utils/validateMongoDBid");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
//create a new user
const createUser = asynchandler(async (req, res) => {
  const {firstname,lastname,mobile,email,password}=req.body
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json({ msg: "account created succefully", newUser });
  } else {
    throw new Error("User already exists");
  }
});
const loginUserCtrl = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user already exists
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 120 * 60 * 60 * 1000,
    });
    res.json({
      msg: `Welcome ${updateuser.firstname}`,
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("check your password or email");
  }
});
//handle refresh token
const handleRefreshToken = asynchandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.retreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jut.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?.id);
    res.json(accessToken);
  });
});
// logout functionality
const logout = asynchandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});
//update a user
const updateaUser = asynchandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({ msg: "user updated", updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

//get all users

const getallUser = asynchandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//get a single user

const getaUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const getaUser = await User.findById(id);
    res.json({ msg: "ofc mr admin ", getaUser });
  } catch (error) {
    throw new Error(error);
  }
});

//delete  a single user

const deleteaUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({ msg: "user deleted ", deleteaUser });
  } catch (error) {
    throw new Error(error);
  }
});
const blockedUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ msg: "user blocked", block });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockedUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  isValidObjectId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ msg: "user unblocked", unblock });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  updateaUser,
  deleteaUser,
  blockedUser,
  unblockedUser,
  handleRefreshToken,
  logout,
};
