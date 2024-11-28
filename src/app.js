require("dotenv").config();
const express = require("express");
const app = express();

//*Built-in middleware

app.use(express.json());

//* Application-level middleware

//* Routes

//* Third-party middleware

module.exports = app;
