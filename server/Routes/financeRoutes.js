const express = require("express")
const { getAllTransaction } = require("../Controllers/financeController")
const protect = require("../Middlewares/authMIddleware")
const router = express.Router()

router.get("/" , protect,  getAllTransaction)

module.exports = router