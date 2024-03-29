const BookData = require("./models/book");
const Review = require("./models/review");

const expressError = require("./errorhandling/expressError");
const { bookvalidation, reviewValidation } = require("./yup");

//middleware to validate the new book is adding
module.exports.validateBook = async (req, res, next) => {
  const { ErrorMessage } = await bookvalidation.validate(req.body.BookData);
  if (ErrorMessage) {
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

//the middleware to check the review
module.exports.reviewvalidate = async (req, res, next) => {
  const { error } = await reviewValidation.validate(req.body.Review);
  if (error) {
    throw new expressError(msg, 404);
  } else {
    next();
  }
};
