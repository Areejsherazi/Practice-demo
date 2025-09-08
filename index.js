 const dotenv = require("dotenv");
dotenv.config({ path: "./config/sampleConfig.env" });
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routers/sampleRoute");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Connected to MongoDB!"))
  .catch((err) => console.error(" Could not connect to MongoDB:", err));

app.use("/api/auth", routes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Auth API is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});