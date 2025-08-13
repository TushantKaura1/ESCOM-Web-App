const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let usersCollection;

function initAuthRoutes(collection) {
  usersCollection = collection;

  // Signup
  router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await usersCollection.findOne({ email });
      if (existing) return res.status(400).json({ error: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const result = await usersCollection.insertOne({ name, email, password: hashed });
      res.status(201).json({ message: "User created" });
    } catch (err) {
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await usersCollection.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Incorrect password" });

      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  return router;
}

module.exports = initAuthRoutes;
