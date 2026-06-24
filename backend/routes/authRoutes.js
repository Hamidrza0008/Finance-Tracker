const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    verifyOTP
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;