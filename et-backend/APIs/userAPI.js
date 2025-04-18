const exp = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const tokenVerify = require("../middlewares/tokenVerify"); // ✅ Correct import

const userApp = exp.Router();
userApp.use(exp.json());

// Register User
userApp.post("/user", expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const newUser = req.body;

  const existingUser = await usersCollection.findOne({ name: newUser.name });
  if (existingUser) {
    return res.status(400).send({ message: "User already exists" });
  }

  newUser.password = await bcryptjs.hash(newUser.password, 7);
  await usersCollection.insertOne(newUser);
  res.send({ message: "User created successfully" });
}));

// Login
userApp.post("/login", expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const { name, password } = req.body;

  const user = await usersCollection.findOne({ name });
  if (!user) {
    return res.status(400).send({ message: "Invalid name or password" });
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send({ message: "Invalid name or password" });
  }

  const token = jwt.sign({ name: user.name }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.send({
    message: "Login successful",
    token,
    user,
  });
}));

// ✅ Update User (now uses token to find current user)
userApp.put("/user", tokenVerify, expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const updatedUser = req.body;
  const currentUserName = req.user.name;

  if (updatedUser.password) {
    updatedUser.password = await bcryptjs.hash(updatedUser.password, 7);
  }

  const result = await usersCollection.updateOne(
    { name: currentUserName },
    { $set: updatedUser }
  );

  if (result.modifiedCount === 0) {
    return res.status(400).send({ message: "User not found or no changes made" });
  }

  res.send({ message: "User updated successfully" });
}));

// Logout
userApp.delete("/user", expressAsyncHandler((req, res) => {
  res.send({ message: "User logged out successfully" });
}));

// Verify User (No need to import tokenVerify here again)
userApp.get('/verify-user', tokenVerify, (req, res) => {
  const usersCollection = req.app.get("usersCollection");

  usersCollection.findOne({ name: req.user.name }).then(user => {
    if (user) {
      res.send({ user });
    } else {
      res.status(401).send({ message: 'User not found' });
    }
  }).catch(() => {
    res.status(500).send({ message: 'Error verifying user' });
  });
});

module.exports = userApp;
