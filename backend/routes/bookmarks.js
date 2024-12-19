const express = require("express");
const router = express.Router();

const { connect, disconnect, getDB } = require("../db");

// Get bookmark data to populate table
router.get("/bookmarks/data", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.user.username;
  try {
    const db = getDB();
    const bookmarks = await db.collection("bookmarks").find({ username }).toArray();
    res.json({ username, bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/bookmarks/add", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, url } = req.body;
  const username = req.session.user.username;

  try {
    const db = getDB();
    const result = await db.collection("bookmarks").insertOne({ username, title, url });
    res.status(201).json({ message: "Bookmark added", id: result.insertedId });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/bookmarks/delete", async (req, res) => {
  const { url } = req.body;
  const username = req.session.user.username; // Assuming the username is stored in session

  if (!username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const db = getDB();
    const result = await db.collection("bookmarks").deleteOne({ url, username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Bookmark not found or user not authorized to delete this bookmark" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ message: "Failed to delete bookmark" });
  }
});

module.exports = router;
