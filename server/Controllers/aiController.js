const expressAsyncHandler = require("express-async-handler");
const Finance = require("../Models/financeModel");
const Pattern = require("../Models/patternModel");
const PatternService = require("../Services/patternService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIReport = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Finance.find({ user: userId })
    .populate("income")
    .populate("expense");

  if (!transactions || transactions.length === 0) {
    res.status(404);
    throw new Error("No transactions found for report generation");
  }

  // helper: format date as dd/mm/yy
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const formattedData = transactions
    .map((t) => {
      if (t.isIncome && t.income) {
        return `Income: ${t.income.title} - ${t.income.ammount} on ${formatDate(
          t.income.createdAt
        )}`;
      } else if (t.expense) {
        return `Expense: ${t.expense.title} - ${t.expense.ammount} (Category: ${
          t.expense.category
        }) on ${formatDate(t.expense.createdAt)}`;
      }
    })
    .join("\n");

const prompt = `
You are a financial advisor. Based on the following transactions, write a personalized financial report for the user. The report should be insightful, actionable, and visually clear.

Transactions:
${formattedData}

Formatting Instructions (very important):
1. Use only these HTML tags: <h1>, <h2>, <h3>, <p>, <ul>, <li>, <table>, <tr>, <td>, <b>, <span>, <hr>.
2. Use only the simplest inline CSS styles: color, font-size, font-weight, border, padding, background-color. Do NOT use gradients, flex, grid, or any class attributes.
3. The top heading ("Personalized Financial Report") should be large, bold, and green (#1b5e20) using only inline style.
4. Use clear section headers: "Summary", "Key Insights", "Spending Breakdown", "Month-on-Month Comparison", "Savings Suggestions", "Conclusion". Make headers bold and green with inline style.
5. Use tables for breakdowns and comparisons. Use <table> with border and padding for clarity.
6. Use bullet points and short paragraphs for clarity.
7. Highlight important numbers with <b> and color (green for income/savings, red for expenses, orange for warnings) using inline style.
8. Use a light green background (#e8f5e9) for suggestion boxes, but only with inline style.
9. All currency is in rupees (₹).
10. Ensure the final output is valid HTML with only inline styles, no markdown fences, no Tailwind, no class attributes, and no unnecessary styling.

Provide the report only in HTML, ready for PDF export.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);
  let report = result.response.text();

  // remove markdown ```html ... ```
  // report = report.replace(/```html|```/g, "");
// console.log(formattedData)
  res.json(report);
});

//Saving Advisorr

const savingAdvisor = expressAsyncHandler(async (req , res) => {

  const userId = req.user._id;
  // res.json({
  //   msg : "Helloo"
  // })
  const { goal, amount } = req.body;

  // console.log(goal )

  if (!goal || !amount) {
    res.status(400);
    throw new Error("Please provide a goal and amount");
  }

  const transactions = await Finance.find({ user: userId })
    .populate("income")
    .populate("expense");

  if (!transactions || transactions.length === 0) {
    res.status(404);
    throw new Error("No transactions found for this user");
  }

  // console.log(transactions)

  // helper: format date as dd/mm/yy
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const formattedData = transactions
    .map((t) => {
      if (t.isIncome && t.income) {
        return `Income: ${t.income.title} - ${t.income.ammount} on ${formatDate(
          t.income.createdAt
        )}`;
      } else if (t.expense) {
        return `Expense: ${t.expense.title} - ${t.expense.ammount} (Category: ${
          t.expense.category
        }) on ${formatDate(t.expense.createdAt)}`;
      }
    })
    .join("\n");

    const prompt = `
      User has set a financial goal: "${goal}" with target amount ₹${amount}.
      Here is the complete history of the user's transactions till date: ${formattedData}.

      Based on this data:
        1. A **main title** at the top (e.g., "Personalized Saving Plan for "${goal}"") styled in bold, large font, and centered.  
      - Analyze the user’s income sources and spending patterns but keep it short
      - Identify unnecessary or avoidable expenses 
      - Create a clear, actionable saving plan for the user
      - Provide a realistic timeline to reach the goal
      - Mention practical steps for cutting down expenses
      - Recommend budget allocation strategies
      - Highlight lifestyle or habit changes if required
      - Be encouraging and motivational in tone
      6. Ensure the final output is valid **HTML with inline styles** (no markdown fences).

      Provide the report only in HTML.
      **Formatting instructions for HTML output:**
  - Use clear headings with <h2> or <h3> tags (e.g., "Income Analysis", "Expense Review", "Saving Plan", "Timeline").
  - Highlight the saving plan and timeline using <div> with background-color (light green background 
   box (#e8f5e9) for saving plan , light blue for timeline).
  - Use color cues for positive tips (green), warnings (red/orange), and motivational notes (blue/purple).
  - use bullet points 
  - Keep everything structured in sections with proper spacing and inline styles.
  - Ensure the final output is valid HTML only (no markdown fences).
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent(prompt);
      let plan = result.response.text();

      // remove markdown ```html ... ```
      // report = report.replace(/```html|```/g, "");
    // console.log(formattedData)
      res.json(plan);



})

//Chat feature 
const personalChat = expressAsyncHandler(async (req , res) => {

  const userId = req.user._id 
  const { userQuery } = req.body 

  // console.log(userQuery)

  const transactions = await Finance.find({ user: userId })
    .populate("income")
    .populate("expense");

  if (!transactions || transactions.length === 0) {
    res.status(404);
    throw new Error("No transactions found for this user");
  }


  if(!userQuery) {
    res.status(400)
    throw new Error ("No Message Is there!")
  }

   // helper: format date as dd/mm/yy
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  const formattedData = transactions
    .map((t) => {
      if (t.isIncome && t.income) {
        return `Income: ${t.income.title} - ${t.income.ammount} on ${formatDate(
          t.income.createdAt
        )}`;
      } else if (t.expense) {
        return `Expense: ${t.expense.title} - ${t.expense.ammount} (Category: ${
          t.expense.category
        }) on ${formatDate(t.expense.createdAt)}`;
      }
    })
    .join("\n");

    const prompt = `You are a financial assistant AI.  
      You will always answer queries based on the user’s financial data provided below.  

      --- USER FINANCIAL DATA ---
      ${formattedData}
      --- END OF DATA ---

      --- USER MESSAGE ---
      ${userQuery}
      --- END OF MESSAGE ---

      Guidelines for your response:
      1. Use the financial data when answering — tailor responses accordingly.  
      2. If the data is missing or unclear, ask clarifying questions.  
      3. Keep your answers simple, clear, and easy to understand.  
      4. Do not repeat the user’s message, directly provide helpful advice.  
      5. If calculations are needed, explain step by step.  

      Now provide the best possible answer to the user’s query.
      `;

      // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const aiResponse = await model.generateContent(prompt);
      let aiMessage = aiResponse.response.text();

      // remove markdown ```html ... ```
      // report = report.replace(/```html|```/g, "");
    // console.log(formattedData)
      res.json(aiMessage);



})

//Hybrid Recurring Transactions Pattern Detection
const detectRecurringPatterns = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. First try to get patterns from database (fastest)
    const dbPatterns = await Pattern.find({ user: userId, isActive: true })
      .sort({ confidence: -1, lastUpdated: -1 });
    
    if (dbPatterns.length > 0) {
      // Return cached patterns immediately
      const formattedPatterns = dbPatterns.map(pattern => ({
        id: pattern._id.toString(),
        title: pattern.title,
        amount: pattern.averageAmount,
        type: pattern.type,
        category: pattern.category,
        frequency: pattern.frequency,
        confidence: pattern.confidence,
        pattern_reason: pattern.patternReason,
        last_occurrence: pattern.lastOccurrence.toLocaleDateString('en-GB'),
        next_expected: pattern.nextExpected.toLocaleDateString('en-GB')
      }));
      
      return res.json(formattedPatterns);
    }

    // 2. Check if we should run full AI analysis
    const shouldRunFull = await PatternService.shouldRunFullAnalysis(userId);
    
    if (shouldRunFull) {
      // 3. Run full AI analysis (expensive but comprehensive)
      const transactionCount = await Finance.countDocuments({ user: userId });
      const range = PatternService.getOptimalDataRange(transactionCount);
      
      console.log(`Running full AI analysis for user ${userId}, range: ${range}`);
      
      const transactions = await PatternService.getTransactionsInRange(userId, range);
      
      if (transactions.length === 0) {
        return res.json([]);
      }

      // Format data for AI
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB");
      };

      const formattedData = transactions
        .map((t) => {
          if (t.isIncome && t.income) {
            return `Income: ${t.income.title} - ₹${t.income.ammount} on ${formatDate(t.income.createdAt)}`;
          } else if (t.expense) {
            return `Expense: ${t.expense.title} - ₹${t.expense.ammount} (Category: ${t.expense.category}) on ${formatDate(t.expense.createdAt)}`;
          }
        })
        .join("\n");

      const prompt = `You are a financial pattern analysis AI. Analyze the following transaction history and identify recurring patterns.

Transactions:
${formattedData}

Your task is to identify recurring financial patterns and return them in a specific JSON format.

Instructions:
1. Analyze transaction titles, amounts, categories, and dates
2. Look for patterns like monthly bills, weekly expenses, daily purchases, etc.
3. Group similar transactions together
4. Determine the most likely frequency (daily, weekly, monthly, quarterly, yearly)
5. Suggest appropriate categories if missing
6. Calculate average amounts for recurring transactions

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique_id",
    "title": "Pattern Name",
    "amount": average_amount,
    "type": "income" or "expense",
    "category": "suggested_category",
    "frequency": "daily" or "weekly" or "monthly" or "quarterly" or "yearly",
    "confidence": 0.85,
    "pattern_reason": "Brief explanation of why this is considered recurring",
    "last_occurrence": "dd/mm/yyyy",
    "next_expected": "dd/mm/yyyy"
  }
]

Rules:
- Only include patterns with confidence > 0.7
- Maximum 20 patterns
- Use realistic categories: food, rent, bills, transport, entertainment, shopping, health, investment, salary, freelance, etc.
- Frequency should be based on actual transaction timing
- Amount should be the average of similar transactions
- Be conservative - only suggest patterns that are clearly recurring

Return ONLY the JSON array, no other text.`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      let patterns = result.response.text();
      
      // Clean up the response to extract just the JSON
      patterns = patterns.replace(/```json|```/g, "").trim();
      
      // Parse the JSON response
      const parsedPatterns = JSON.parse(patterns);
      
      // Store patterns in database for future use
      await PatternService.storePatterns(userId, parsedPatterns);
      
      res.json(parsedPatterns);
    } else {
      // 4. Run lightweight analysis (fast, no AI)
      const transactionCount = await Finance.countDocuments({ user: userId });
      const range = PatternService.getOptimalDataRange(transactionCount);
      const recentTransactions = await PatternService.getTransactionsInRange(userId, range);
      
      const lightPatterns = await PatternService.lightPatternAnalysis(userId, recentTransactions);
      
      // Format for response
      const formattedLightPatterns = lightPatterns.map(pattern => ({
        id: `light_${Date.now()}_${Math.random()}`,
        title: pattern.title,
        amount: pattern.amount,
        type: pattern.type,
        category: pattern.category,
        frequency: pattern.frequency,
        confidence: pattern.confidence,
        pattern_reason: pattern.patternReason,
        last_occurrence: new Date().toLocaleDateString('en-GB'),
        next_expected: PatternService.calculateNextExpected(new Date(), pattern.frequency).toLocaleDateString('en-GB')
      }));
      
      res.json(formattedLightPatterns);
    }
  } catch (error) {
    console.error('Hybrid Pattern Detection Error:', error);
    
    // 5. Fallback to basic pattern detection
    try {
      const transactions = await Finance.find({ user: userId })
        .populate("income")
        .populate("expense");
      
      if (transactions.length === 0) {
        return res.json([]);
      }
      
      const fallbackPatterns = await PatternService.lightPatternAnalysis(userId, transactions);
      
      const formattedFallback = fallbackPatterns.map(pattern => ({
        id: `fallback_${Date.now()}_${Math.random()}`,
        title: pattern.title,
        amount: pattern.amount,
        type: pattern.type,
        category: pattern.category,
        frequency: pattern.frequency,
        confidence: pattern.confidence,
        pattern_reason: pattern.patternReason,
        last_occurrence: new Date().toLocaleDateString('en-GB'),
        next_expected: PatternService.calculateNextExpected(new Date(), pattern.frequency).toLocaleDateString('en-GB')
      }));
      
      res.json(formattedFallback);
    } catch (fallbackError) {
      console.error('Fallback pattern detection also failed:', fallbackError);
      res.status(500).json({ 
        error: "Failed to detect patterns", 
        fallback: [] 
      });
    }
  }
});

// New endpoint for quick pattern updates when transactions are added
const updatePatternsWithTransaction = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { transaction } = req.body;
  
  try {
    const result = await PatternService.updatePatternsWithTransaction(userId, transaction);
    res.json(result);
  } catch (error) {
    console.error('Pattern update error:', error);
    res.status(500).json({ error: "Failed to update patterns" });
  }
});

// New endpoint for getting patterns without AI analysis
const getCachedPatterns = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  try {
    const patterns = await PatternService.getUserPatterns(userId);
    res.json(patterns);
  } catch (error) {
    console.error('Get cached patterns error:', error);
    res.status(500).json({ error: "Failed to get patterns" });
  }
});

module.exports = { 
  generateAIReport, 
  savingAdvisor, 
  personalChat, 
  detectRecurringPatterns,
  updatePatternsWithTransaction,
  getCachedPatterns
};
