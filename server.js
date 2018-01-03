const express = require("express");
const utils = require("./utils.js");

const app = express();

const port = process.env.PORT || 3000;


app.get("/", function (request, result) {
  result.send("OK!");
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});

app.get("/health-check", function (request, result) {
  utils.healthCheck((error, resultQuery) => {
    if (error) {
      result.send(error);
    } else {
      result.send(resultQuery);
    }
  })
});
