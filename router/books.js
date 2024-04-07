const express = require("express");
const router = express.Router();

const wrapAsync = require("../errorhandling/wrapAsync");
const { validateBook, auth } = require("../middleware");

const bookController = require("../controllers/book");

router
  .route("/")
  //to dispaly all the book
  .get(wrapAsync(bookController.dispalybooks))
  //adding new book
  .post(validateBook, wrapAsync(bookController.addbook));

//adding new book -user should logged in
router.get("/new", auth, bookController.addbookform);

router
  .route("/:id")
  //to show single book details
  .get(wrapAsync(bookController.bookdetails))
  //to edit the single book data
  .put(validateBook, wrapAsync(bookController.editbookdata))
  //delete the single book data -user should logged in
  .delete(auth, wrapAsync(bookController.deletebook));

//to edit the single book data -user should logged in
router.get("/:id/edit", auth, wrapAsync(bookController.editbookform));

module.exports = router;
