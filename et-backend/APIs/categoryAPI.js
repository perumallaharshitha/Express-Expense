const express = require("express");
const categoryApp = express.Router();
const tokenVerify = require("../middlewares/tokenVerify");
const { ObjectId } = require("mongodb");

// Add entry to a specific category
categoryApp.post("/add/:category", tokenVerify, async (req, res) => {
  const { category } = req.params;
  const data = req.body;
  data.category = category;

  try {
    const collection = req.app.get("categoriesCollection");
    await collection.insertOne(data);
    res.status(201).send({ message: `${category} entry added`, data });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to add entry" });
  }
});

// Get all entries of a specific category
categoryApp.get("/get/:category", tokenVerify, async (req, res) => {
  const { category } = req.params;
  try {
    const collection = req.app.get("categoriesCollection");
    const entries = await collection.find({ category }).toArray();
    res.status(200).send({ message: `${category} data fetched`, data: entries });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch category data" });
  }
});

// Update an entry by ID
categoryApp.put("/update/:id", tokenVerify, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const collection = req.app.get("categoriesCollection");
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.send({ message: "Entry updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to update entry" });
  }
});

// Delete an entry by ID
categoryApp.delete("/delete/:id", tokenVerify, async (req, res) => {
  const { id } = req.params;

  try {
    const collection = req.app.get("categoriesCollection");
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.send({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to delete entry" });
  }
});

module.exports = categoryApp;
