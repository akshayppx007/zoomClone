const mongoose = require("mongoose");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDatabase;
