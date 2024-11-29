require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const { corsOptions } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errorHandler");

const authRouter = require("../src/modules/auth/auth.routes");
const postRouter = require("../src/modules/post/posts.routes");

//*Built-in middleware

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//* Application-level middleware

//* Routes

app.use("/auth", authRouter);
app.use("/posts", postRouter);

//* Third-party middleware

app.use(helmet());
app.use(cors(corsOptions));

//* 404 Error Handler

app.use((req, res, next) => {
  console.log("This Path Not Found", req.path);
  return res.status(404).json({ message: "Oops!! Page Not Found!!" });
});

//* Global Error Handler
app.use(errorHandler);

module.exports = app;
