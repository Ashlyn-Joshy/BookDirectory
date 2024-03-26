const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

const BookData = require("./models/book");
const expressError = require("./errorhandling/expressError");
const { bookvalidation } = require("./yup");
const wrapAsync = require("./errorhandling/wrapAsync");

//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/bookdirectory");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

app.engine("ejs", engine);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//routes
app.get("/", (req, res) => {
  res.render("home");
});

//routes for books
//to dispaly all the book
app.get(
  "/book",
  wrapAsync(async (req, res) => {
    const book = await BookData.find({});
    res.render("books/", { book });
  })
);
//middleware to validate the new book is adding
const validateBook = async (req, res, next) => {
  const { ErrorMessage } = await bookvalidation.validate(req.body.BookData);
  if (ErrorMessage) {
    throw new expressError(msg, 400);
  } else {
    next();
  }
};
//adding new book
app.get("/book/new", (req, res) => {
  res.render("books/new");
});
app.post(
  "/book",
  validateBook,
  wrapAsync(async (req, res) => {
    const books = await new BookData(req.body.BookData);
    await books.save();
    res.redirect(`/book`);
  })
);
//to show single book details
app.get(
  "/book/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await BookData.findById(id);
    res.render("books/show", { book });
  })
);
//to edit the single book data
app.get(
  "/book/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await BookData.findById(id);
    res.render("books/edit", { book });
  })
);
app.put(
  "/book/:id",
  validateBook,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await BookData.findByIdAndUpdate(id, req.body.BookData);
    await book.save();
    res.redirect(`/book/${id}`);
  })
);
//delete the single book data
app.delete(
  "/book/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const book = await BookData.findByIdAndDelete(id);
    res.redirect(`/book`);
  })
);

//if the page is not defined
app.all("*", (req, res, next) => {
  next(new expressError("page not found", 404));
});
//basic error handler
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "something went wrong";
  }
  res.status(status).render("errorpage", { err });
});

//working on port
const port = 8080;
app.listen(port, () => {
  console.log(`working on the port ${port}`);
});
