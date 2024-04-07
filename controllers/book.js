const BookData = require("../models/book");

module.exports.dispalybooks = async (req, res) => {
  const book = await BookData.find({});
  res.render("books/", { book });
};

module.exports.addbook = async (req, res) => {
  const books = await new BookData(req.body.BookData);
  books.isAdminApproved = false;
  await books.save();
  req.flash("done", "New book request is send to admin");
  res.redirect(`/book`);
};

module.exports.addbookform = (req, res) => {
  res.render("books/new");
};

module.exports.bookdetails = async (req, res) => {
  const { id } = req.params;
  const book = await BookData.findById(id).populate({
    path: "reviews",
    populate: {
      path: "reviewwriter",
    },
  });
  res.render("books/show", { book });
};

module.exports.editbookdata = async (req, res) => {
  const { id } = req.params;
  const book = await BookData.findByIdAndUpdate(id, req.body.BookData);
  await book.save();
  req.flash("done", "Data is updated");
  res.redirect(`/book/${id}`);
};

module.exports.deletebook = async (req, res) => {
  //if we are deleting a book data we also delete the all the reviews for that perticular book - code is in the models-books.js file
  const { id } = req.params;
  await BookData.findByIdAndDelete(id);
  req.flash("error", "Book is Deleted");
  res.redirect(`/book`);
};

module.exports.editbookform = async (req, res) => {
  const { id } = req.params;
  const book = await BookData.findById(id);
  res.render("books/edit", { book });
};
