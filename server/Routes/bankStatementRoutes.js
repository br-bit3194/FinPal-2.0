const express = require("express");
const router = express.Router();
const protect = require("../Middlewares/authMIddleware");
const bankStatementController = require("../Controllers/bankStatementController");

// Process bank statement PDF
router.post("/process", protect, bankStatementController.upload.single('pdf'), bankStatementController.processBankStatement);

// Get processing status
router.get("/status", protect, bankStatementController.getProcessingStatus);

module.exports = router;
