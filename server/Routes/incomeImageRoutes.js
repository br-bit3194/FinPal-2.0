const express = require("express");
const router = express.Router();
const { processIncomeReceipt } = require("../Controllers/incomeImageController");
const protect = require("../Middlewares/authMIddleware");



// Route for processing income receipts
router.post("/process-income-receipt", protect, processIncomeReceipt);

module.exports = router;
