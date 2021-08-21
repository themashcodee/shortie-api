const express = require("express");
const app = express();
const compression = require("compression");
import routes from "./api/routes/index";
import connectDB from "./config/mangodb";
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

(async function () {
  try {
    await connectDB();
    app.use(
      express.urlencoded({ extended: true }),
      express.json(),
      compression(),
      cookieParser(),
      cors({
        origin: ["https://shortie.netlify.app", "http://localhost:3000"],
        credentials: true,
      })
    );
    routes(app, "/api/v1");
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server Running...");
    });
  } catch (err) {
    console.log(err);
  }
})();
