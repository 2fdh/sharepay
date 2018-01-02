const express = require("express");

const app = express();

const port = process.env.PORT || 3000;


app.get("/", function (request, result) {
  result.send("OK!");
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
