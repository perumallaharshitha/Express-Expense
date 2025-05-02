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
    const result = await collection.insertOne(data);
    
    // Retrieve the inserted item to send back with _id
    const insertedItem = await collection.findOne({ _id: result.insertedId });

    res.status(201).json({ message: `${category} entry added`, data: insertedItem });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ message: "Failed to add entry" });
  }
});

// Get all entries of a specific category
categoryApp.get("/get/:category", tokenVerify, async (req, res) => {
  const { category } = req.params;
  try {
    const collection = req.app.get("categoriesCollection");
    const entries = await collection.find({ category }).toArray();
    res.status(200).json({ message: `${category} data fetched`, data: entries });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch category data" });
  }
});

// Update an entry by ID
categoryApp.put("/update/:id", tokenVerify, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const collection = req.app.get("categoriesCollection");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No entry found to update" });
    }

    res.json({ message: "Entry updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update entry" });
  }
});

// Delete an entry by ID
categoryApp.delete("/delete/:id", tokenVerify, async (req, res) => {
  const { id } = req.params;

  try {
    const collection = req.app.get("categoriesCollection");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No entry found to delete" });
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
});

module.exports = categoryApp;
