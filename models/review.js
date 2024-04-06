const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  text: String,
  rating: Number,
  reviewwriter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//exporting review model
module.exports = mongoose.model("Review", reviewSchema);
