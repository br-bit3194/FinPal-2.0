const expressAsyncHandler = require("express-async-handler")
const Income = require("../Models/incomeModel")
const User = require("../Models/userModel")
const Finance = require("../Models/financeModel")


const getAllIncomes = expressAsyncHandler(async (req, res) => {

    const income = await Income.find({ user: req.user._id }).sort({ transactionDate: -1, createdAt: -1 });
    console.log(`Found ${income.length} incomes for user ${req.user.email}`);
    if (!income) {
        res.status(400)
        throw new Error("No incomes found for the user")
    }

    res.status(200).json(income)

})

const addIncome = expressAsyncHandler(async (req, res) => {

    const { title, ammount, category, transactionDate } = req.body

    if (!title || !ammount) {
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

    const income = await Income.create({
        user: req.user._id, title, ammount, category, transactionDate: parsedTransactionDate
    })

    if (!income) {
        res.status(400)
        throw new Error("Error in adding income")
    }

    const finance = await Finance.create({
        user: req.user._id, income: income._id
    })


    res.status(200).json(income)

})


const updateIncome = expressAsyncHandler(async (req, res) => {

    // const {title , description} = req.body
    const incomeId = req.params.iid

    const income = await Income.findById(incomeId)

    if (!income) {
        res.status(400)
        throw new Error("Cannot find income to update")
    }

    const updatedIncome = await Income.findByIdAndUpdate(incomeId, req.body, { new: true })

    if (!updatedIncome) {
        res.status(400)
        throw new Error("Error in updating Income")
    }

    res.status(200).json(updatedIncome)

})


const deleteIncome = expressAsyncHandler(async (req, res) => {

    const incomeId = req.params.iid
    const finance = await Finance.findOne({ income: incomeId })
    // console.log(finance)

    const deletedIncome = await Income.findByIdAndDelete(incomeId)
    const deletedFinance = await Finance.findByIdAndDelete(finance._id)

    if (!deletedIncome) {
        res.status(400)
        throw new Error("Error in deleting income")
    }

    // console.log(deletedFinance)

    res.status(200).json(deletedIncome)


}
)

module.exports = { getAllIncomes, addIncome, updateIncome, deleteIncome }