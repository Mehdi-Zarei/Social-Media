require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const { corsOptions } = require("./middlewares/headers");

const authRouter = require("../src/modules/auth/auth.routes");

//*Built-in middleware

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//* Application-level middleware

//* Routes

app.use("/auth", authRouter);

//* Third-party middleware

app.use(helmet());
app.use(cors(corsOptions));

//* 404 Error Handler

app.use((req, res) => {
  console.log("This Path Not Found", req.path);
  return res.status(404).json({ message: "Oops!! Page Not Found!!" });
});

module.exports = app;
