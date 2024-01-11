// Put add, get, update, and delete routes for books here
import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();

// We need to post an array of books to the /books endpoint, and store them in the database.
router.post("/books", async (request, response) => {
  try {
    // Check if the request body is an array
    if (!Array.isArray(request.body)) {
      return response
        .status(400)
        .send({ message: "Invalid data format. Expecting an array." });
    }
    // Array to store created books
    const createdBooks = [];

    // Iterate over each book in the array
    for (const bookData of request.body) {
      // Check if all required data is present for each book
      if (!bookData.title || !bookData.author || !bookData.publishYear) {
        // If not, skip this book and continue with the next
        console.log(
          `Skipping book due to missing required data: ${JSON.stringify(
            bookData
          )}`
        );
        continue;
      }

      // Create a new book
      const book = new Book({
        title: bookData.title,
        author: bookData.author,
        publishYear: bookData.publishYear,
      });

      // Save the book
      const createdBook = await Book.create(book);
      createdBooks.push(createdBook);
    }
    // Send the book in the response
    return response.status(201).json(createdBooks);
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

// get all books from the database and send them in the response.
router.get("/books", async (request, response) => {
  try {
    // Get all books
    const books = await Book.find({});
    // Send the books in the response
    return response.status(200).json({
      // reformatted the response to include a count of the books
      count: books.length,
      books: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// get a single book by id
router.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);
    if (!book) {
      return response.status(404).send({ message: "Book not found." });
    }
    // Send the book in the response
    return response.status(200).json({ book });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// update a single book by id, we need to send all the required fields in the request body.
router.put("/books/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({ message: "Please send all required fields." });
    }
    const { id } = request.params;
    // update book by request body
    const result = await Book.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).send({ message: "Book not found." });
    }
    return response.status(200).json({ message: "Book updated." });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// delete a single book by id
router.delete("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).send({ message: "Book not found." });
    }
    return response.status(200).json({ message: "Book deleted." });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
