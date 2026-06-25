const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/connection");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Connect DB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: "https://expanse-tracker-chi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 
};

// This single line handles BOTH regular requests and OPTIONS preflight requests automatically
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("Finance Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});