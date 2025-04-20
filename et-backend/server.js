const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Initialize the Express app
const app = express();

// Use CORS to allow frontend communication
app.use(cors({
  origin: 'http://localhost:5173',  // Change this to the frontend URL if different
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
let mClient = new MongoClient(process.env.DB_URL);
mClient
  .connect()
  .then((connectionObj) => {
    const fsddb = connectionObj.db("exp");  // Your DB name
    const usersCollection = fsddb.collection("tests");
    const categoriesCollection = fsddb.collection("categories"); // Create the 'categories' collection
    app.set("usersCollection", usersCollection);  // Set collection to be used in user routes
    app.set("categoriesCollection", categoriesCollection);  // Set collection to be used in category routes

    console.log("DB connection success");

    // Start the server
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started on port 5000");
    });
  })
  .catch((err) => console.log("Error in DB connection", err));

// Import the user API routes
const userApp = require("./APIs/userAPI");
app.use("/user-api", userApp);  // Use the user API routes

// Import the category API routes
const categoryApp = require("./APIs/categoryAPI");
app.use("/category-api", categoryApp);  // Use the category API routes

// Handle invalid routes
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Invalid path' });
});
