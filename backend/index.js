import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRouter from "./routes/booksRoute.js";
import cors from "cors";

const app = express();

// Middleware to parse the body of the request
app.use(express.json());

// Middleware to allow requests from other origins
// handle CORS policy error
// method 1: allow all origins
app.use(cors());

// method 2: allow specific origins
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET, POST, PUT, DELETE",
//     allowedHeaders: "Content-Type",
//   })
// );

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Hi!");
});

// use the books router, to handle all the requests to /books
app.use(booksRouter);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
