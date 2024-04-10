const jwt = require("jsonwebtoken");
const expressError = require("../errorhandling/expressError");
const { bookvalidation } = require("../yup");

const Admin = require("../models/admin");
const Books = require("../models/book");

//the middleware to authenticate the admin
module.exports.authAdmin = async (req, res, next) => {
  const token = req.cookies.jwtAdmin;
  if (token) {
    jwt.verify(token, process.env.MY_JWT_SECRET, (err, decodeToken) => {
      if (err) {
        res.redirect("/admin");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/admin");
  }
};
//the middleware to identify the current admin
module.exports.currentUserAdmin = async (req, res, next) => {
  const token = req.cookies.jwtAdmin;
  if (token) {
    jwt.verify(token, process.env.MY_JWT_SECRET, async (err, decodeToken) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else {
        let admin = await Admin.findById(decodeToken.id);
        res.locals.admin = admin;
        req.admin = admin;
        next();
      }
    });
  } else {
    res.locals.admin = null;
    next();
  }
};

//middleware to validate the new book is adding
module.exports.validateBookAdmin = async (req, res, next) => {
  try {
    const { error } = await bookvalidation.validate(req.body.Books);
    if (error) {
      throw new expressError(msg, 400);
    } else {
      next();
    }
  } catch (error) {
    res.redirect("/admin/addbook");
  }
};
