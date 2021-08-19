import mongoose from "mongoose";
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MANGODB_URI!, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.connection.on("open", () => {
    console.log("Database Connected");
  });
  mongoose.connection.on("error", () => {
    console.log("Database not able to Connect");
  });
};
export default connectDB;
