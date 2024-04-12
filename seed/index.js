if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const book = require("./books");
const BookData = require("../models/book");
const Review = require("../models/review");

//mongoose connection
const database =
  process.env.DB_URL || "mongodb://127.0.0.1:27017/bookdirectory";
mongoose.connect(database);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const seedDB = async () => {
  await BookData.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const randomBook = Math.floor(Math.random() * 100); //selecting random books from seed/books.js
    const books = new BookData({
      author: `${book[randomBook].author}`,
      country: `${book[randomBook].country}`,
      language: `${book[randomBook].language}`,
      pages: `${book[randomBook].pages}`,
      title: `${book[randomBook].title}`,
      year: `${book[randomBook].year}`,
      isAdminApproved: true,
      userOwner: "6616be83caeb2f6ae5585cb3",
    });
    await books.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
