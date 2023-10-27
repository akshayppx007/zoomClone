const User = require("../models/userModel");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

// register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, isAdmin } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    isAdmin,
  });

  sendToken(user, 200, res);
});

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// get users by roomId
exports.getUsersWithRoomId = catchAsyncErrors(async (req, res, next) => {
  const roomId = req.params.id;

  const users = await User.find({roomId: roomId});

  res.status(200).json({
    success: true,
    users,
  });
});

// get user profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
});

// update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, phoneNumber, address, roomId } = req.body;

  let user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      phoneNumber,
      address,
      roomId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    user,
  });
});

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// admin routes
// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
