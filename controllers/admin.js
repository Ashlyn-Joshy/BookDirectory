const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const Books = require("../models/book");
const Review = require("../models/review");

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.MY_JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.adminRegisterPost = async (req, res) => {
  const { adminId, password, confirmpassword } = req.body;
  try {
    if (password !== confirmpassword) {
      res.status(400).json("password must be equal to confirmpassword");
    }
    const newAdmin = await Admin.create({ adminId, password });
    const token = createToken(newAdmin._id);
    res.cookie("jwtAdmin", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.send("admin is created ");
  } catch (error) {
    res.json(error.message);
  }
};

module.exports.adminLoginForm = (req, res) => {
  res.render("admin/login");
};

module.exports.adminLogin = async (req, res) => {
  const { adminId, password } = req.body;
  try {
    //calling the statics method login
    const adminData = await Admin.login(adminId, password);
    const token = createToken(adminData._id);
    res.cookie("jwtAdmin", token, { httpOnly: true, maxAge: maxAge * 1000 });
    req.flash("done", "welcome Admin");
    res.redirect(`/admin/index`);
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/admin");
  }
};

module.exports.adminLogout = (req, res) => {
  res.cookie("jwtAdmin", "", { maxAge: 1 });
  req.flash("done", "Good bye admin");
  res.redirect("/");
};

module.exports.displayBooks = async (req, res) => {
  const books = await Books.find();
  res.render("admin/", { books });
};

module.exports.addNewBookForm = (req, res) => {
  res.render("admin/newbook");
};

module.exports.addNewBook = async (req, res) => {
  const book = await new Books(req.body.Books);
  book.adminOwner = req.admin._id;
  book.isAdminApproved = true;
  await book.save();
  req.flash("done", "New book is added to the database");
  res.redirect(`/admin/index`);
};

module.exports.bookForApproval = async (req, res) => {
  const books = await Books.find();
  res.render("admin/bookrequest", { books });
};

module.exports.showBookDetails = async (req, res) => {
  const { id } = req.params;
  const book = await Books.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "reviewwriter",
      },
    })
    .populate("adminOwner")
    .populate("userOwner");
  res.render("admin/show", { book });
};

module.exports.editBookForm = async (req, res) => {
  const { id } = req.params;
  const book = await Books.findById(id);
  res.render("admin/edit", { book });
};

module.exports.editBook = async (req, res) => {
  const { id } = req.params;
  const book = await Books.findByIdAndUpdate(id, req.body.Books);
  await book.save();
  req.flash("done", "Data is updated");
  res.redirect(`/admin/book/${id}`);
};

module.exports.deleteBook = async (req, res) => {
  //if we are deleting a book data we also delete the all the reviews for that perticular book - code is in the models-books.js file
  const { id } = req.params;
  await Books.findByIdAndDelete(id);
  req.flash("error", "Book is Deleted");
  res.redirect(`/admin/index`);
};

module.exports.deleteAReview = async (req, res) => {
  const { id, reviewid } = req.params;
  //here if we are deleting the revieiw the review should remove from the book database also
  const book = await Books.findByIdAndUpdate(id, {
    $pull: { reviews: reviewid },
  });
  //deleting the review form the review database
  await Review.findByIdAndDelete(reviewid);
  await book.save();
  req.flash("error", "Review is deleted");
  res.redirect(`/admin/book/${id}`);
};
