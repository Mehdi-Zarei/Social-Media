require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();

//*Built-in middleware

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//* Application-level middleware

//* Routes

//* Third-party middleware

app.use(helmet());

//* 404 Error Handler

app.use((req, res) => {
  console.log("This Path Not Found", req.path);
  return res.status(404).json({ message: "Oops!! Page Not Found!!" });
});

module.exports = app;
