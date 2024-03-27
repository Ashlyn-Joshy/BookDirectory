const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  author: String,
  country: String,
  language: String,
  pages: Number,
  title: String,
  year: Number,
  isAdminApproved: Boolean,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//if we are deleting a book data we also delete the all the reviews for that perticular book - this is the middleware
bookSchema.post("findOneAndDelete", async function (book) {
  console.log(book);
  const Review = require("./review");
  if (book.reviews.length) {
    await Review.deleteMany({ _id: { $in: book.reviews } });
  }
});
//exporting book model
module.exports = mongoose.model("Books", bookSchema);
