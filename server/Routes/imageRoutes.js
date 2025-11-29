const express = require("express");
const router = express.Router();
const { processReceiptImage } = require("../Controllers/imageController");
const protect = require("../Middlewares/authMIddleware");

// Route for processing receipt images
router.post("/process-receipt", protect, processReceiptImage);

module.exports = router;
