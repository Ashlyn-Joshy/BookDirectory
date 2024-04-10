const express = require("express");
const router = express.Router();

const wrapAsync = require("../errorhandling/wrapAsync");
const {
  validateBook,
  auth,
  isOwner,
  currentUser,
} = require("../middleware/user");

const bookController = require("../controllers/book");

router
  .route("/")
  //to dispaly all the book
  .get(wrapAsync(bookController.dispalybooks))
  //adding new book
  .post(validateBook, auth, currentUser, wrapAsync(bookController.addbook));

//adding new book -user should logged in
router.get("/new", auth, bookController.addbookform);

router
  .route("/:id")
  //to show single book details
  .get(wrapAsync(bookController.bookdetails))
  //to edit the single book data
  .put(
    validateBook,
    currentUser,
    isOwner,
    wrapAsync(bookController.editbookdata)
  )
  //delete the single book data -user should logged in and the user must be the owner to delete the data of the book
  .delete(auth, currentUser, isOwner, wrapAsync(bookController.deletebook));

//to edit the single book data -user should logged in and the user must be the owner to edit the data of the book
router.get("/:id/edit", auth, isOwner, wrapAsync(bookController.editbookform));

module.exports = router;
