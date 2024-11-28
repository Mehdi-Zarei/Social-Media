const app = require("./app");

function startServer() {
  app.listen(4000, () => {
    console.log(`Server Running On Port ${process.env.PORT}`);
  });
}

function run() {
  startServer();
}

run();
