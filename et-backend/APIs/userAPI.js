// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Create userApp router
const userApp = express.Router();

// Add body parser middleware
userApp.use(express.json());

// Helper function to verify JWT token
const tokenVerify = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: "Access Denied. No token provided." });
  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
};

// POST request to create a new user (Public Route)
userApp.post('/users', expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get('usersCollection');
  let newUser = req.body;

  let existingUser = await usersCollection.findOne({ username: { $eq: newUser.username } });
  if (existingUser) return res.status(400).send({ message: "User Already Exists" });

  let hashedPassword = await bcrypt.hash(newUser.password, 9);
  newUser.password = hashedPassword;
  newUser.expenses = [];
  newUser.registerDate = new Date(); // Store the registration date

  await usersCollection.insertOne(newUser);

  let token = jwt.sign({ username: newUser.username }, process.env.SECRET, { expiresIn: '1h' });

  let userToReturn = { ...newUser };
  delete userToReturn.password;

  res.status(201).send({ message: "User Created", payload: userToReturn, token });
}));

// User Login (Public Route)
userApp.post('/login', expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get('usersCollection');
  let userInfo = req.body;

  let user = await usersCollection.findOne({ firstname: { $eq: userInfo.username } });
  if (!user) return res.status(400).send({ message: "Invalid Username" });

  let isPasswordCorrect = await bcrypt.compare(userInfo.password, user.password);
  if (!isPasswordCorrect) return res.status(400).send({ message: "Invalid Password" });

  let token = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: '1h' });

  res.send({ message: "Login Success", token: token, user: { ...user, password: undefined } });
}));

// Get all expenses for the logged-in user (Protected Route)
userApp.get('/users/expenses', tokenVerify, expressAsyncHandler(async (req, res) => {
    console.log('req: ', req);
  const usersCollection = req.app.get('usersCollection');
  let user = await usersCollection.findOne({ username: { $eq: req.user.username } });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send({ message: "Expenses retrieved successfully", expenses: user.expenses, registrationDate: user.registerDate });
}));

// Add a new expense for the logged-in user (Protected Route)
userApp.post('/users/expenses', tokenVerify, expressAsyncHandler(async (req, res) => {
    console.log('req: ', req);
  const usersCollection = req.app.get('usersCollection');
  const newExpense = req.body;

  let user = await usersCollection.findOne({ username: { $eq: req.user.username } });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // Add new expense to user's expense array
  user.expenses.push(newExpense);
  await usersCollection.updateOne({ username: { $eq: req.user.username } }, { $set: { expenses: user.expenses } });

  res.send({ message: "Expense added successfully", expenses: user.expenses });
}));

// Delete an expense for the logged-in user (Protected Route)
userApp.delete('/users/expenses/:id', tokenVerify, expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get('usersCollection');
  const expenseId = req.params.id;

  let user = await usersCollection.findOne({ username: { $eq: req.user.username } });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // Filter out the expense with the given id
  user.expenses = user.expenses.filter(expense => expense.id !== expenseId);
  await usersCollection.updateOne({ username: { $eq: req.user.username } }, { $set: { expenses: user.expenses } });

  res.send({ message: "Expense deleted successfully", expenses: user.expenses });
}));

// Export userApp
module.exports = userApp;
