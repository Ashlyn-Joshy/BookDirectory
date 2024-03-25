const mongoose = require("mongoose");
const BookData = require("../models/book");

//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/bookdirectory");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const seedDB = async () => {
  await BookData.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const randomBook = Math.floor(Math.random() * 100); //selecting random books from seed/books.js
    const book = new BookData({
      author: `${book[randomBook].author}`,
      country: `${book[randomBook].country}`,
      language: `${book[randomBook].language}`,
      pages: `${book[randomBook].pages}`,
      title: `${book[randomBook].title}`,
      year: `${book[randomBook].year}`,
    });
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});