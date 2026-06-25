const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/connection");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://expanse-tracker-chi.vercel.app"
  ],
  credentials: true
}));

app.options("*", cors());


// Routes Integration
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Base Route
app.get("/", (req, res) => {
    res.send("Finance Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});