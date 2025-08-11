//import modules from mongoose
const { Schema, model } = require("mongoose");

//create a book schema
const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  copies: {
    type: Number,
    required: true,
    min: 0,
  },
});

// create the book model using the schema
 const Book = model("Book", bookSchema);

// export the book model
module.exports = Book;
