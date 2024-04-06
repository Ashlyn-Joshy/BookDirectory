const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { signupInfo } = require("../middleware");
const User = require("../models/user");

const wrapAsync = require("../errorhandling/wrapAsync");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.MY_JWT_SECRET, {
    expiresIn: maxAge,
  });
};

//routes for the user singup , singin and logout
router
  .route("/signup")
  .get((req, res) => {
    res.render("user/register");
  })
  .post(
    signupInfo,
    wrapAsync(async (req, res) => {
      const { name, email, password, confirmpassword } = req.body;
      try {
        //checking the password and confirm password are same
        if (password !== confirmpassword) {
          req.flash("error", "Password should be match to confirm password");
          return res.redirect("/signup");
        }
        //checking user have the same email id
        const findUser = await User.findOne({ email });
        if (findUser) {
          req.flash("error", "User with this email already exists");
          return res.redirect("/signup");
        }
        //saving the user data to the db
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        req.flash("done", "Welcome to the book directory");
        res.redirect("/book");
      } catch (error) {
        console.log(error);
        res.status(400).json("error, user not created");
      }
    })
  );

router
  .route("/signin")
  .get((req, res) => {
    res.render("user/login");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      //calling the statics method login
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      req.flash("done", "Welcome to Books Directory");
      res.redirect("/book");
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/signin");
    }
  });

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  req.flash("done", "Good bye");
  res.redirect("/");
});

module.exports = router;
