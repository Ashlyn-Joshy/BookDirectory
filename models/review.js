const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  text: String,
  rating: Number,
});

//exporting review model
module.exports = mongoose.model("Review", reviewSchema);
