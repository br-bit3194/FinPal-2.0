const expressAsyncHandler = require("express-async-handler");
const Finance = require("../Models/financeModel")

const getAllTransaction = expressAsyncHandler(async (req, res) => {

    const transactions = await Finance.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('income').populate('expense');
    console.log(`Found ${transactions.length} transactions for user ${req.user.email}`);

    if (!transactions) {
        res.status(400)
        throw new Error("No transactions found")
    }

    res.status(200).json(transactions)

})

module.exports = { getAllTransaction }