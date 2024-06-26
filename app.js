if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");

const expressError = require("./errorhandling/expressError");
const { currentUser } = require("./middleware/user");
const { currentUserAdmin } = require("./middleware/admin");

const bookRouter = require("./router/books");
const reviewRouter = require("./router/review");
const userRouter = require("./router/user");
const adminRouter = require("./router/admin");

//mongoose connection
const database =
  process.env.DB_URL || "mongodb://127.0.0.1:27017/bookdirectory";
mongoose.connect(database);
mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
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
app.use(express.json());
app.use(cookieParser());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.get("*", currentUser); //currentuser data is sending here
app.get("*", currentUserAdmin); //current data about the admin

const secret = process.env.SECRET || "thisismytopsecret";
const store = MongoStore.create({
  mongoUrl: database,
  touchAfter: 24 * 60 * 60,
  secret,
});

store.on("error", function (e) {
  console.log("section store error", e);
});

//session config
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionConfig));

// Middleware to flash message
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
app.use("/", userRouter);
app.use("/admin", adminRouter);

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
