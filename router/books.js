const express = require("express");
const router = express.Router();

const BookData = require("../models/book");

const wrapAsync = require("../errorhandling/wrapAsync");
const { validateBook } = require("../middleware");

router
  .route("/")
  //to dispaly all the book
  .get(
    wrapAsync(async (req, res) => {
      const book = await BookData.find({});
      res.render("books/", { book });
    })
  )
  //adding new book
  .post(
    validateBook,
    wrapAsync(async (req, res) => {
      const books = await new BookData(req.body.BookData);
      books.isAdminApproved = false;
      await books.save();
      req.flash("done", "New Book is added");
      res.redirect(`/book`);
    })
  );

//adding new book
router.get("/new", (req, res) => {
  res.render("books/new");
});

router
  .route("/:id")
  //to show single book details
  .get(
    wrapAsync(async (req, res) => {
      const { id } = req.params;
      const book = await BookData.findById(id).populate("reviews");
      res.render("books/show", { book });
    })
  )
  //to edit the single book data
  .put(
    validateBook,
    wrapAsync(async (req, res) => {
      const { id } = req.params;
      const book = await BookData.findByIdAndUpdate(id, req.body.BookData);
      await book.save();
      req.flash("done", "Data is updated");
      res.redirect(`/book/${id}`);
    })
  )
  //delete the single book data
  .delete(
    wrapAsync(async (req, res) => {
      //if we are deleting a book data we also delete the all the reviews for that perticular book - code is in the models-books.js file
      const { id } = req.params;
      await BookData.findByIdAndDelete(id);
      req.flash("error", "Book is Deleted");
      res.redirect(`/book`);
    })
  );

//to edit the single book data
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await BookData.findById(id);
    res.render("books/edit", { book });
  })
);

module.exports = router;
