const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//* Load ENV

const productionMode = process.env.NODE_ENV === "Production";

if (!productionMode) {
  dotenv.config();
}

function startServer() {
  app.listen(4000, () => {
    console.log(
      `Server Running in ${
        productionMode ? "Production" : "Development"
      } Mode On Port ${process.env.PORT}`
    );
  });
}

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected To DB Successfully : ${mongoose.connection.host}.`);
  } catch (error) {
    console.error("Error In DataBase Connection ==>", error), process.exit(1);
  }
}

function run() {
  startServer();
  connectToDB();
}

run();
