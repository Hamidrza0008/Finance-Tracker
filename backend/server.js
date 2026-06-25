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
const allowedOrigins = [
  'https://expanse-tracker-chi.vercel.app', // Aapki live Vercel site
  'http://localhost:3000'                    // Aapka local development url
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or postman/curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true 
};

// Use CORS with options
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