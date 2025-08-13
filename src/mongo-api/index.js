// index.js
const express = require("express");
const connectDB = require("./db");
const usersRoutes = require("./routes/users");
require("dotenv").config();

const app = express();
app.use(express.json());

(async () => {
  const db = await connectDB();
  const usersCollection = db.collection("users");

  app.use("/users", usersRoutes(usersCollection));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 API running at http://localhost:${PORT}`);
  });
})();
