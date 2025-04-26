// app.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const collageRoutes = require("./routes/collageRoute");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/collage", collageRoutes);

// Basic home route
app.get("/", (req, res) => {
  res.send("Welcome to My E-commerce Backend");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
