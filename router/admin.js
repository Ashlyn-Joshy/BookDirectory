const express = require("express");
const router = express.Router();

const {
  authAdmin,
  validateBookAdmin,
  currentUserAdmin,
} = require("../middleware/admin");
const adminControllers = require("../controllers/admin");
const wrapAsync = require("../errorhandling/wrapAsync");

//admin login
router
  .route("/")
  .get(adminControllers.adminLoginForm)
  .post(wrapAsync(adminControllers.adminLogin));

//admin register here
router.post("/register", wrapAsync(adminControllers.adminRegisterPost));

router
  .route("/book/:id")
  .get(authAdmin, wrapAsync(adminControllers.showBookDetails)) //view each book details
  .put(authAdmin, wrapAsync(adminControllers.editBook))
  .delete(authAdmin, wrapAsync(adminControllers.deleteBook)); //admin delete book

//admin edit book
router.get(
  "/book/:id/edit",
  authAdmin,
  wrapAsync(adminControllers.editBookForm)
);

//deleting a perticular  review from the book details page
router.delete(
  "/book/:id/review/:reviewid",
  authAdmin,
  wrapAsync(adminControllers.deleteAReview)
);

router
  .route("/index")
  .get(authAdmin, wrapAsync(adminControllers.displayBooks)) //admin display all the books -- admin should logged in
  .post(
    validateBookAdmin,
    currentUserAdmin,
    wrapAsync(adminControllers.addNewBook)
  ); //add new book

//add new book
router.get("/addbook", authAdmin, adminControllers.addNewBookForm);

//new book request from the user side waiting for the approval
router.get(
  "/book/request",
  authAdmin,
  wrapAsync(adminControllers.bookForApproval)
);

//admin logout
router.get("/logout", adminControllers.adminLogout);

module.exports = router;
