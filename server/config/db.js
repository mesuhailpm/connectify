const mongoose = require("mongoose");

let isConnected;
const connectDB = async () => {
    
  if (isConnected) {

    console.log("Connection to Database is already established!");

    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
