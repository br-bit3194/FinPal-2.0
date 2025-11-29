const express = require("express")
const {addIncome, updateIncome, deleteIncome, getAllIncomes } = require("../Controllers/incomeController")
const protect = require("../Middlewares/authMIddleware")
const router = express.Router()

router.get("/" , protect ,  getAllIncomes)
router.post("/" , protect , addIncome)
router.put("/:iid" , protect , updateIncome)
router.delete("/:iid" , protect , deleteIncome)

module.exports = router