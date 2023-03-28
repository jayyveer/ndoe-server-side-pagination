// This code imports the required modules first.

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./users");

// This connects to a MongoDB database, creates and adds some sample users to it.
// It uses Mongoose library to interact with the database.

mongoose.connect("mongodb://localhost/pagination", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", async () => {
  if ((await User.countDocuments().exec()) > 0) return;

  Promise.all([
    // The following lines of code create 12 user objects and insert them in the Users collection.
    User.create({ name: "User 1" }),
    User.create({ name: "User 2" }),
    User.create({ name: "User 3" }),
    User.create({ name: "User 4" }),
    User.create({ name: "User 5" }),
    User.create({ name: "User 6" }),
    User.create({ name: "User 7" }),
    User.create({ name: "User 8" }),
    User.create({ name: "User 9" }),
    User.create({ name: "User 10" }),
    User.create({ name: "User 11" }),
    User.create({ name: "User 12" }),
  ]).then(() => console.log("Added Users"));
});

// A GET endpoint is created that accepts two queries
//  - page: specifies the page number for pagination
//  - limit: specifies the number of results per page. 
// It returns paginated users data using async/await approach.

app.get("/users", paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
});

// This function returns a middleware function that can be used to paginate the results
function paginatedResults(model) {
  // The middleware function is an async function with req, res, and next parameters
  return async (req, res, next) => {
    // Get the page number from the request query or default to 1
    const page = parseInt(req.query.page, 10) || 1;
    // Get the limit from the request query or default to 10
    const limit = parseInt(req.query.limit, 10) || 10;

    // Calculate the number of items to skip based on the page and limit
    const skip = (page - 1) * limit;
    // Calculate the end index for the current page
    const end = page * limit;

    // Execute two parallel promises: count the total number of documents in the model,
    // and find the documents for the current page using skip and limit
    const countPromise = model.countDocuments().exec();
    const resultsPromise = model.find().limit(limit).skip(skip).exec();

    // Wait for both promises to resolve using Promise.all
    const [count, results] = await Promise.all([countPromise, resultsPromise]);

    // Calculate the total number of pages based on the count and limit
    const pages = Math.ceil(count / limit);
    // Calculate the next and previous page numbers, or set them to null
    const nextPage = page >= pages ? null : page + 1;
    const prevPage = page <= 1 ? null : page - 1;

    // Create an object with pagination information and results for the current page
    const pagination = { page, pages, count, limit, nextPage, prevPage };
    const data = { pagination, results };

    // Attach the paginated results to the response object and call the next middleware
    res.paginatedResults = data;
    next();
  };
}



// This runs the express app on port 3006.

app.listen(3006);

/*
Reference - https://www.youtube.com/watch?v=ZX3qt0UWifc&list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY&index=8
*/