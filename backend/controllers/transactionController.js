const Transaction = require("../models/Transaction");

// add transaction
const addTransaction = async (req, res) => {
    try {
        const {
            title,
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,
            title,
            amount,
            type,
            category,
            description,
            date
        });

        res.status(201).json({
            message: "Transaction Added Successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// get pagination
const getTransactions = async (req, res) => {
    try {
        const {
            type,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        let filter = { user: req.user._id };

        if (type) {
            filter.type = type;
        }

        let sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "latest" || sort === "newest") sortOption = { createdAt: -1 };
        if (sort === "high") sortOption = { amount: -1 };
        if (sort === "low") sortOption = { amount: 1 };

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const [total, transactions] = await Promise.all([
            Transaction.countDocuments(filter),
            Transaction.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNumber)
        ]);

        res.status(200).json({
            transactions,
            pagination: {
                totalTransactions: total,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber)
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// get all
const getAllTransactions = async (req, res) => {
    try {
        const allTransactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

        res.status(200).json({
            allTransactions
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    getAllTransactions
};