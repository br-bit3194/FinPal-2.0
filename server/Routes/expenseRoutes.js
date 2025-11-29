const express = require("express")
const { addExpense, updateExpense, deleteExpense, getAllExpenses } = require("../Controllers/expenseController")
const protect = require("../Middlewares/authMIddleware")
const router = express.Router()

router.get("/" , protect , getAllExpenses)
router.post("/" , protect , addExpense)
router.put("/:eid" , protect , updateExpense)
router.delete("/:eid" , protect , deleteExpense)

module.exports = router