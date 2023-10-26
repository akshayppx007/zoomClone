const mongoose = require("mongoose");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

const connectDatabase = catchAsyncErrors(async () => {
  const connect = await mongoose.connect(process.env.DB_URI);
  console.log("Database connected successfully");
});

module.exports = connectDatabase;
