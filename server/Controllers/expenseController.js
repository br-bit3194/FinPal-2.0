const expressAsyncHandler = require("express-async-handler")
const Expense = require("../Models/expenseModel")
const User = require("../Models/userModel")
const Finance = require("../Models/financeModel")

const getAllExpenses = expressAsyncHandler(async (req, res) => {

    const expense = await Expense.find({ user: req.user._id }).sort({ transactionDate: -1, createdAt: -1 });
    console.log(`Found ${expense.length} expenses for user ${req.user.email}`);
    if (!expense) {
        res.status(400)
        throw new Error("No expenses found for the user")
    }

    res.status(200).json(expense)

})

const addExpense = expressAsyncHandler(async (req, res) => {

    const { title, ammount, category, transactionDate } = req.body

    if (!title || !ammount || !category) {
        res.status(400)
        throw new Error("Please fill all the details")
    }

    // Parse transaction date or use current date
    let parsedTransactionDate = new Date();
    if (transactionDate) {
        parsedTransactionDate = new Date(transactionDate);
        if (isNaN(parsedTransactionDate.getTime())) {
            parsedTransactionDate = new Date();
        }
    }

    const expense = await Expense.create({
        user: req.user._id, title, ammount, category, transactionDate: parsedTransactionDate
    })

    if (!expense) {
        res.status(400)
        throw new Error("Error in adding expense")
    }

    const finance = await Finance.create({
        user: req.user._id, expense: expense._id, isIncome: false
    })

    res.status(200).json(expense)

})


const updateExpense = expressAsyncHandler(async (req, res) => {

    const { title, description } = req.body
    const expenseId = req.params.eid

    const expense = await Expense.findById(expenseId)

    if (!expense) {
        res.status(400)
        throw new Error("Cannot find expense to update")
    }

    const updatedexpense = await Expense.findByIdAndUpdate(expenseId, req.body, { new: true })

    if (!updatedexpense) {
        res.status(400)
        throw new Error("Error in updating expense")
    }

    res.status(200).json(updatedexpense)

})


const deleteExpense = expressAsyncHandler(async (req, res) => {

    const expenseId = req.params.eid
    const finance = await Finance.findOne({ expense: expenseId })


    const deletedexpense = await Expense.findByIdAndDelete(expenseId)
    const deletedFinance = await Finance.findByIdAndDelete(finance._id)


    if (!deletedexpense) {
        res.status(400)
        throw new Error("Error in deleting expense")
    }

    res.status(200).json(deletedexpense)


}
)


module.exports = { getAllExpenses, addExpense, updateExpense, deleteExpense }