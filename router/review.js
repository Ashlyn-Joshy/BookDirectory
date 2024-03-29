const express = require("express");
const router = express.Router();

const BookData = require("../models/book");
const Review = require("../models/review");

const wrapAsync = require("../errorhandling/wrapAsync");
const { reviewvalidate } = require("../middleware");

//adding review to the book details
router.post(
  "/book/:id/review",
  reviewvalidate,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await BookData.findById(id);
    console.log(book);
    const review = await new Review(req.body.Review);
    book.reviews.push(review);
    await review.save();
    await book.save();
    console.log(book);
    req.flash("done", "Review is added");
    res.redirect(`/book/${id}`);
  })
);
//deleting the review from the book details
router.delete(
  "/book/:id/review/:reviewid",
  wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    //here if we are deleting the revieiw the review should remove from the book database also
    const camp = await BookData.findByIdAndUpdate(id, {
      $pull: { reviews: reviewid },
    });
    //deleting the review form the review database
    await Review.findByIdAndDelete(reviewid);
    await camp.save();
    req.flash("error", "Review is deleted");
    res.redirect(`/book/${id}`);
  })
);

module.exports = router;
