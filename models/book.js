const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  author: String,
  country: String,
  language: String,
  pages: Number,
  title: String,
  year: Number,
});

//exporting book model
module.exports = mongoose.model("Books", bookSchema);
