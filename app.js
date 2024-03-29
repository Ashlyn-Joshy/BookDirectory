const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const BookData = require("./models/book");
const Review = require("./models/review");

const expressError = require("./errorhandling/expressError");
const { bookvalidation, reviewValidation } = require("./yup");
const wrapAsync = require("./errorhandling/wrapAsync");

const bookRouter = require("./router/books");
const reviewRouter = require("./router/review");

//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/bookdirectory");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

app.engine("ejs", engine);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

//session config
const sessionConfig = {
  name: "raju",
  secret: "raju'stopsecretishere",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

//middleware to dispaly the flash message
app.use((req, res, next) => {
  res.locals.done = req.flash("done");
  res.locals.error = req.flash("error");
  next();
});
//routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/book", bookRouter);
app.use("/", reviewRouter);

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
