const express = require("express");
const router = express.Router();

const {
    addTransaction,
    getTransactions,
    getAllTransactions
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.route("/")
    .get(getTransactions)
    .post(addTransaction);

router.post("/add", addTransaction);

router.get("/all", getAllTransactions);

module.exports = router;