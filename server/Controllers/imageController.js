require("dotenv").config()
const expressAsyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Expense = require("../Models/expenseModel");
const Finance = require("../Models/financeModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Function to convert image to base64
const imageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
};

// Function to get image mime type
const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
  };
  return mimeTypes[ext] || "image/jpeg";
};

// Enhanced AI prompt for better receipt extraction
const getEnhancedPrompt = () => {
  return `
    You are an expert financial data extractor. Analyze this receipt image and extract the following information in valid JSON format:

    {
      "title": "Brief, descriptive title of the purchase (e.g., 'Grocery shopping at Walmart', 'Coffee at Starbucks')",
      "amount": "Total amount as a number only (e.g., 25.99, 150.00)",
      "category": "One of these exact categories: food, rent, travel, entertainment, shopping, others",
      "date": "Date from receipt in YYYY-MM-DD format, or today's date if not found",
      "merchant": "Store/merchant name (e.g., 'Walmart', 'Starbucks', 'Shell Gas Station')",
      "confidence": "High/Medium/Low based on image clarity and text readability"
    }

    CRITICAL GUIDELINES:
    1. Return ONLY valid JSON - no markdown, no additional text
    2. For amount: extract only the TOTAL amount, ignore individual item prices
    3. For category: choose the most appropriate category based on merchant type and items
    4. For confidence: 
       - "High" = Clear, readable text with good image quality
       - "Medium" = Somewhat readable but may have minor issues
       - "Low" = Blurry, unclear, or very poor image quality
    5. If the image is not a receipt or completely unreadable, return confidence as "Low"
    6. For date: if no date found, use today's date in YYYY-MM-DD format
    7. For title: make it descriptive but concise (max 50 characters)
    8. Ensure all fields are present and properly formatted

    Examples of good titles:
    - "Grocery shopping at Walmart"
    - "Coffee and breakfast at Starbucks"
    - "Gas fill-up at Shell"
    - "Restaurant dinner at Olive Garden"
    - "Online purchase from Amazon"
  `;
};

const processReceiptImage = expressAsyncHandler(async (req, res) => {
  let imagePath = null;
  
  try {
    // Use multer upload middleware
    upload.single("receipt")(req, res, async function (err) {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ 
          success: false,
          error: "File upload error: " + err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: "No image file uploaded" 
        });
      }

      imagePath = req.file.path;
      console.log("Processing receipt:", req.file.originalname);

      // Validate file exists and is readable
      if (!fs.existsSync(imagePath)) {
        return res.status(400).json({ 
          success: false,
          error: "Uploaded file not found" 
        });
      }

      const base64Image = imageToBase64(imagePath);
      const mimeType = getMimeType(imagePath);

      // Create the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Prepare the image part
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      };

      const prompt = getEnhancedPrompt();

      try {
        console.log("Sending request to Gemini AI...");
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response.text();
        console.log("Raw AI response:", response);

        // Clean up the uploaded file
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          imagePath = null;
        }

        // Try to parse the JSON response
        let extractedData;
        try {
          // Remove any markdown formatting if present
          const cleanResponse = response.replace(/```json|```/g, "").trim();
          extractedData = JSON.parse(cleanResponse);
          console.log("Parsed extracted data:", extractedData);
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          console.error("Raw response:", response);
          return res.status(500).json({
            success: false,
            error: "Failed to parse extracted data from AI response",
            details: "The AI response could not be parsed as valid JSON",
            rawResponse: response.substring(0, 200) + "..."
          });
        }

        // Enhanced validation of extracted data
        const validationErrors = [];
        
        if (!extractedData.title || typeof extractedData.title !== 'string' || extractedData.title.trim().length === 0) {
          validationErrors.push("Title is required and must be a non-empty string");
        }
        
        if (!extractedData.amount || (typeof extractedData.amount !== 'number' && typeof extractedData.amount !== 'string')) {
          validationErrors.push("Amount is required and must be a valid number");
        }
        
        if (!extractedData.category || typeof extractedData.category !== 'string') {
          validationErrors.push("Category is required");
        }
        
        if (!extractedData.merchant || typeof extractedData.merchant !== 'string') {
          validationErrors.push("Merchant is required");
        }
        
        if (!extractedData.date || typeof extractedData.date !== 'string') {
          validationErrors.push("Date is required");
        }
        
        if (!extractedData.confidence || !['high', 'medium', 'low'].includes(extractedData.confidence.toLowerCase())) {
          validationErrors.push("Confidence must be High, Medium, or Low");
        }

        if (validationErrors.length > 0) {
          return res.status(400).json({
            success: false,
            error: "Invalid data extracted from receipt",
            validationErrors,
            extractedData
          });
        }

        // Ensure user is present from protect middleware
        if (!req.user || !req.user._id) {
          return res.status(401).json({ 
            success: false,
            error: "Unauthorized: user not found" 
          });
        }

        // Normalize amount (remove commas, currency symbols)
        const parseAmount = (amt) => {
          if (typeof amt === 'number') return amt;
          if (typeof amt !== 'string') return null;
          const cleaned = amt.replace(/[^0-9.-]/g, '');
          const n = parseFloat(cleaned);
          return Number.isFinite(n) && n > 0 ? n : null;
        };

        const amountValue = parseAmount(extractedData.amount);
        if (amountValue === null || amountValue <= 0) {
          return res.status(400).json({ 
            success: false,
            error: 'Invalid amount extracted - must be a positive number',
            extractedData 
          });
        }

        // Validate category against enum in expense model
        const allowedCategories = ['food', 'rent', 'travel', 'shopping', 'entertainment', 'others'];
        let category = (extractedData.category || '').toString().toLowerCase();
        if (!allowedCategories.includes(category)) {
          category = 'others';
        }

        // Validate date format
        let expenseDate = new Date();
        console.log("AI extracted date:", extractedData.date);
        try {
          if (extractedData.date && extractedData.date !== 'today') {
            const parsedDate = new Date(extractedData.date);
            console.log("Parsed date:", parsedDate.toISOString());
            if (!isNaN(parsedDate.getTime())) {
              // Check if the parsed date is reasonable (not too far in the past or future)
              const now = new Date();
              const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
              const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
              
              if (parsedDate >= oneYearAgo && parsedDate <= oneYearFromNow) {
                expenseDate = parsedDate;
                console.log("Using extracted date from receipt:", parsedDate.toISOString());
              } else {
                console.warn("Extracted date is outside reasonable range, using current date");
                console.warn("Extracted date:", parsedDate.toISOString());
                console.warn("One year ago:", oneYearAgo.toISOString());
                console.warn("One year from now:", oneYearFromNow.toISOString());
                expenseDate = new Date();
              }
            }
          }
        } catch (dateError) {
          console.warn("Date parsing error, using current date:", dateError);
        }
        console.log("Final expense date:", expenseDate.toISOString());

        // Create expense record
        let createdExpense;
        try {
          createdExpense = await Expense.create({
            user: req.user._id,
            title: extractedData.title.trim(),
            ammount: amountValue,
            category,
            transactionDate: expenseDate  // Set transaction date from extracted receipt date
          });
          console.log("Expense created successfully:", createdExpense._id);
        } catch (dbErr) {
          console.error('Error creating expense from receipt:', dbErr);
          return res.status(500).json({ 
            success: false,
            error: 'Failed to save expense to database',
            details: dbErr.message 
          });
        }

        // Create finance entry linking to the expense
        try {
          await Finance.create({
            user: req.user._id,
            expense: createdExpense._id,
            isIncome: false
          });
          console.log("Finance record created successfully");
        } catch (finErr) {
          console.error('Error creating finance record:', finErr);
          // Not a blocking error for the main response, but report it
        }

        // Respond with both created expense and extracted data
        res.json({
          success: true,
          message: "Receipt processed successfully",
          data: {
            ...extractedData,
            amount: amountValue, // Ensure amount is the parsed number
            category: category, // Ensure category is normalized
            date: expenseDate.toISOString().split('T')[0] // Format date consistently
          },
          expense: {
            _id: createdExpense._id,
            title: createdExpense.title,
            amount: createdExpense.ammount,
            category: createdExpense.category,
            createdAt: createdExpense.createdAt
          }
        });

      } catch (aiError) {
        // Clean up the uploaded file
        if (imagePath && fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          imagePath = null;
        }

        console.error("AI processing error:", aiError);
        res.status(500).json({
          success: false,
          error: "Failed to process the receipt image with AI",
          details: aiError.message,
          suggestion: "Please ensure the image is clear and contains readable text"
        });
      }
    });
  } catch (error) {
    // Clean up the uploaded file
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during receipt processing",
      details: error.message
    });
  }
});

module.exports = { processReceiptImage };
