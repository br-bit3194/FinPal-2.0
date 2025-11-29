
const express = require("express")
const protect = require("../Middlewares/authMIddleware")
const router = express.Router() 
const {generateAIReport, savingAdvisor, personalChat, detectRecurringPatterns, updatePatternsWithTransaction, getCachedPatterns} = require("../Controllers/aiController")

router.get("/report" , protect , generateAIReport )
router.post("/saving" , protect ,   savingAdvisor);
router.post("/chat" , protect ,   personalChat);
router.get("/patterns" , protect , detectRecurringPatterns);
router.post("/patterns/update" , protect , updatePatternsWithTransaction);
router.get("/patterns/cached" , protect , getCachedPatterns);

module.exports = router