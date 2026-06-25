require('dotenv').config();
const express = require("express");
const cors = require("cors");
require("dns").setDefaultResultOrder("ipv4first");

const connectDB = require("./config/connection");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

connectDB();

const allowedOrigins = [
  "https://expanse-tracker-chi.vercel.app",
  "https://finance-tracker-chi.vercel.app", // Aapka naya URL agar badla hai toh
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Finance Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});