const express = require("express");
const router = express.Router();

const wrapAsync = require("../errorhandling/wrapAsync");
const { reviewvalidate, auth, currentUser } = require("../middleware");

const reviewController = require("../controllers/review");

//adding review to the book details
router.post(
  "/book/:id/review",
  reviewvalidate,
  currentUser,
  wrapAsync(reviewController.addReview)
);
//deleting the review from the book details
router.delete(
  "/book/:id/review/:reviewid",
  auth,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
