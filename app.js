const express = require("express");
const mongoose = require("mongoose");

//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/bookdirectory");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

//working on port
const port = 8080;
app.listen(port, () => {
  console.log(`working on the port ${port}`);
});
