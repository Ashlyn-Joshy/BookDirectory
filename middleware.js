const jwt = require("jsonwebtoken");

const BookData = require("./models/book");
const Review = require("./models/review");
const User = require("./models/user");

const expressError = require("./errorhandling/expressError");
const { bookvalidation, reviewValidation, singupValidation } = require("./yup");

//middleware to validate the new book is adding
module.exports.validateBook = async (req, res, next) => {
  try {
    const { error } = await bookvalidation.validate(req.body.BookData);
    if (error) {
      throw new expressError(msg, 400);
    } else {
      next();
    }
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/book/new");
  }
};

//the middleware to check the review
module.exports.reviewvalidate = async (req, res, next) => {
  try {
    const { error } = await reviewValidation.validate(req.body.Review);
    if (error) {
      throw new expressError(msg, 400);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

//the middleware to check the singup data
module.exports.signupInfo = async (req, res, next) => {
  try {
    const { error } = await singupValidation.validate(req.body);
    if (error) {
      throw new expressError("Invalid signup data", 400); // Change the status code if appropriate
    } else {
      next();
    }
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

//the middleware to authenticate the user
module.exports.auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.MY_JWT_SECRET, (err, decodeToken) => {
      if (err) {
        res.redirect("/signin");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/signin");
  }
};

//the middleware to check the current user
module.exports.currentUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.MY_JWT_SECRET, async (err, decodeToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodeToken.id);
        res.locals.user = user;
        req.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
