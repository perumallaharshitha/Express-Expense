const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Initialize the Express app
const app = express();

// Use CORS to allow frontend communication
app.use(cors({
  origin: 'http://localhost:5173',
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
    app.set("usersCollection", usersCollection);  // Set collection to be used in routes
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

// Handle invalid routes
app.use('*', (req, res) => {
  res.send({ message: 'Invalid path' });
});
