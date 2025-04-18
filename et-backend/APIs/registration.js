// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config();

const registrationApp = express.Router();

// Add body parser middleware
registrationApp.use(express.json());

// POST request to register a new user (Public Route)
registrationApp.post('/register', expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get('usersCollection');
    const newUser = req.body;

    // Verify if the user already exists
    const existingUser = await usersCollection.findOne({ username: { $eq: newUser.username } });

    if (existingUser) {
        return res.status(400).send({ message: "User Already Exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newUser.password, 9);
    newUser.password = hashedPassword;

    // Initialize expenses field if not present
    newUser.expenses = newUser.expenses || [];

    // Insert new user into the database
    await usersCollection.insertOne(newUser);

    res.status(201).send({ message: "User Created", payload: newUser });
}));

// Export the registrationApp
module.exports = registrationApp;
