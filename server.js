const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Book = require("./book.schema.js");

//load env variables
dotenv.config();

//set up app
const app = express();

//bring in env variables
const PORT = process.env.PORT || 8081;
const MONGO = process.env.MONGODB;

//check connection
console.log(`Mongo: ${MONGO}`);

//middleware to parse JSON bodies
app.use(express.json());

//connect to mongoDB
mongoose.connect(`${MONGO}/fetchingDataCollection`);
const db = mongoose.connection;
db.once("open", () => {
  console.log(`Connected to: ${MONGO}`);
});

//route to get all books in Library
app.get("/api/library", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving Library." });
  }
});

//route to get a single book by id
app.get("/api/library/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ message: `Book with id: ${req.params.id} not found.` });
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Error retrieving book with id: ${req.params.id}.` });
  }
});

//route to create a new book
app.post("/api/library", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({
      message: "Book created successfully!",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating book." });
  }
});

//route to update a book by id
app.post("/api/library/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res
        .status(404)
        .json({ message: `Book with id: ${req.params.id} not found.` });
    } else {
      res.status(200).json({
        message: "Book updated successfully!",
        book: updatedBook,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Error updating book with id: ${req.params.id}.` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
