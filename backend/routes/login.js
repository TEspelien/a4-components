const express = require('express');
const router = express.Router();

var bcrypt = require("bcryptjs"); //to encrypt passwords

const { connect, disconnect, getDB } = require("../db");


const usersCollectionName = "users";

// POST /login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const db = await connect();
      const usersCollection = db.collection(usersCollectionName);
  
      // Check if the user exists
      const existingUser = await usersCollection.findOne({ username });
  
      if (existingUser) {
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (passwordMatch) {
          req.session.user = existingUser; // Save user in session
          return res.json({
            message: "Login successful.",
            success: true,
            isNewUser: false,
            redirectTo: "/bookmarks", // Redirect on successful login
          });
        } else {
          return res.status(401).json({ message: "Invalid password.", success: false });
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // User does not exist, add to the database
        await usersCollection.insertOne({ username, password: hashedPassword });
  
        // Set user info in session for new user
        req.session.user = {username, "password": hashedPassword};
  
        console.log("New user added, redirecting to bookmarks.");
  
        return res.json({
          message: "New user created successfully.",
          success: true,
          isNewUser: true, // new user!
          redirectTo: "/bookmarks",
        });
      }
    } catch (err) {
      console.error("Error handling login:", err);
      res.status(500).json({ message: "Internal server error.", success: false });
    }
  });

  module.exports = router;