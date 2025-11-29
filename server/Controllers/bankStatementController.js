require("dotenv").config()
const expressAsyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdf = require('pdf-parse');

const Expense = require("../Models/expenseModel");
const Income = require("../Models/incomeModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for PDF upload
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
    fileSize: 50 * 1024 * 1024, // 50MB limit for PDFs
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf';

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

// Function to validate PDF file before processing
const validatePDFFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    
    // Check file size (should be reasonable for a bank statement)
    if (stats.size < 1024) { // Less than 1KB
      throw new Error("PDF file too small - likely corrupted or empty");
    }
    if (stats.size > 50 * 1024 * 1024) { // More than 50MB
      throw new Error("PDF file too large - please upload a smaller file");
    }
    
    // Check if file exists and is readable
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found");
    }
    
    // Read first few bytes to check PDF header
    const buffer = fs.readFileSync(filePath, { start: 0, end: 1024 });
    const header = buffer.toString('ascii', 0, 5);
    
    if (header !== '%PDF-') {
      throw new Error("Invalid PDF file format - file does not appear to be a PDF");
    }
    
    // Check for end of file marker
    const endMarker = buffer.toString('ascii', buffer.length - 6);
    if (!endMarker.includes('%%EOF')) {
      console.log("Warning: PDF may not have proper end marker");
    }
    
    return true;
  } catch (error) {
    throw new Error(`PDF validation failed: ${error.message}`);
  }
};

// Enhanced function to extract text from PDF with multiple fallback methods
const extractTextFromPDF = async (filePath) => {
  try {
    // Method 1: Try pdf-parse with enhanced error handling
    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      // Validate PDF file structure before processing
      const header = dataBuffer.toString('ascii', 0, 5);
      if (header !== '%PDF-') {
        throw new Error("Invalid PDF file format");
      }
      
      // Check file size and structure
      if (dataBuffer.length < 100) {
        throw new Error("PDF file too small or corrupted");
      }
      
      const data = await pdf(dataBuffer, {
        // Add options to handle problematic PDFs
        normalizeWhitespace: true,
        disableCombineTextItems: false
      });
      
      if (data.text && data.text.trim().length > 0) {
        console.log("Successfully extracted text using pdf-parse");
        return data.text;
      } else {
        throw new Error("No text content found in PDF");
      }
    } catch (error) {
      console.log("pdf-parse failed, trying alternative methods:", error.message);
    }

    // Method 2: Try with different pdf-parse options
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer, {
        normalizeWhitespace: false,
        disableCombineTextItems: true,
        max: 0 // Process all pages
      });
      
      if (data.text && data.text.trim().length > 0) {
        console.log("Successfully extracted text using pdf-parse with alternative options");
        return data.text;
      }
    } catch (error) {
      console.log("Alternative pdf-parse options failed:", error.message);
    }

    // Method 3: Try processing page by page
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer, {
        max: 1 // Process only first page
      });
      
      if (data.text && data.text.trim().length > 0) {
        console.log("Successfully extracted text from first page");
        return data.text;
      }
    } catch (error) {
      console.log("Single page processing failed:", error.message);
    }

    // Method 4: Basic text extraction from PDF buffer
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const text = dataBuffer.toString('utf8');
      
      // Look for text patterns in the PDF content
      const textPatterns = [
        /\([^)]{3,100}\)/g,  // Text in parentheses
        /\/Text\s+[^\n]+/g,  // Text objects
        /[A-Za-z0-9\s]{10,}/g  // General text patterns
      ];
      
      let extractedText = "";
      for (const pattern of textPatterns) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
          extractedText = matches
            .map(match => match.replace(/[()\/\\]/g, ''))
            .filter(text => text.length > 5 && !text.includes('\\'))
            .join(' ');
          break;
        }
      }
      
      if (extractedText.trim().length > 0) {
        console.log("Successfully extracted text using basic pattern matching");
        return extractedText;
      }
    } catch (error) {
      console.log("Basic pattern matching failed:", error.message);
    }

    // Method 5: Try to repair common PDF issues
    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      // Check if it's a linearized PDF (common in modern PDFs)
      const isLinearized = dataBuffer.toString('ascii').includes('/Linearized');
      
      if (isLinearized) {
        console.log("PDF is linearized, trying alternative parsing approach");
        // For linearized PDFs, try to extract text from specific objects
        const text = dataBuffer.toString('utf8');
        const streamMatches = text.match(/stream[\s\S]*?endstream/g);
        
        if (streamMatches && streamMatches.length > 0) {
          let streamText = "";
          for (const stream of streamMatches) {
            const cleanStream = stream.replace(/stream|endstream/g, '').trim();
            if (cleanStream.length > 10) {
              streamText += cleanStream + " ";
            }
          }
          
          if (streamText.trim().length > 0) {
            console.log("Successfully extracted text from PDF streams");
            return streamText;
          }
        }
      }
    } catch (error) {
      console.log("PDF repair attempt failed:", error.message);
    }

    // If all methods fail, provide helpful error message
    throw new Error("All PDF text extraction methods failed. The PDF may be corrupted, password-protected, or in an unsupported format. Please try uploading a different PDF file.");

  } catch (error) {
    console.error("PDF extraction error:", error);
    
    // Provide specific error messages for common issues
    if (error.message.includes('bad XRef entry')) {
      throw new Error("PDF file appears to be corrupted or has structural issues. Please try uploading a different PDF file or contact your bank for a new statement.");
    } else if (error.message.includes('password')) {
      throw new Error("PDF file appears to be password-protected. Please remove the password protection and try again.");
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error("The uploaded file is not a valid PDF. Please ensure you're uploading a PDF bank statement.");
    } else {
      throw new Error(`Error extracting text from PDF: ${error.message}`);
    }
  }
};

// Enhanced AI prompt for bank statement analysis
const getBankStatementPrompt = (pdfText) => {
  return `
    You are an expert financial data extractor specializing in bank statements. Analyze this bank statement text and extract all transactions in valid JSON format.

    BANK STATEMENT TEXT:
    ${pdfText}

    Extract the following information for each transaction in this JSON format:
    {
      "transactions": [
        {
          "date": "YYYY-MM-DD format",
          "description": "Transaction description/merchant name",
          "amount": "Amount as a number (positive for credits, negative for debits)",
          "type": "credit or debit",
          "category": "One of these exact categories: food, rent, travel, entertainment, shopping, salary, investment, others",
          "confidence": "High/Medium/Low based on text clarity"
        }
      ],
      "summary": {
        "totalCredits": "Total credits as number",
        "totalDebits": "Total debits as number",
        "netAmount": "Net amount (credits - debits)",
        "period": "Statement period (e.g., 'January 2025')"
      }
    }

    CRITICAL GUIDELINES:
    1. Return ONLY valid JSON - no markdown, no additional text
    2. For amount: 
       - Credits (incoming money): positive numbers
       - Debits (outgoing money): negative numbers
    3. For category: choose the most appropriate category based on description
    4. For confidence: 
       - "High" = Clear, readable transaction details
       - "Medium" = Somewhat readable but may have minor issues
       - "Low" = Unclear or incomplete transaction details
    5. If the text is not a bank statement or completely unreadable, return confidence as "Low"
    6. For date: if no date found, use today's date in YYYY-MM-DD format
    7. For description: make it descriptive but concise (max 100 characters)
    8. Ensure all fields are present and properly formatted
    9. Handle various bank statement formats (HDFC, SBI, ICICI, etc.)

    Examples of good descriptions:
    - "Salary credit from ABC Corp"
    - "ATM withdrawal at HDFC Bank"
    - "Online payment to Amazon"
    - "UPI transfer to John Doe"
    - "Interest credit on savings"
  `;
};

// Process bank statement PDF
const processBankStatement = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const filePath = req.file.path;
    const userId = req.user._id;

    // Validate PDF file before processing
    try {
      validatePDFFile(filePath);
    } catch (validationError) {
      // Clean up file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: validationError.message,
        suggestion: "Please try uploading a different PDF file or contact your bank for a new statement."
      });
    }

    // Extract text from PDF
    const pdfText = await extractTextFromPDF(filePath);

    // Use Gemini AI to analyze the text
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = getBankStatementPrompt(pdfText);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Parse AI response
    let parsedData;
    try {
      // Extract JSON from AI response (remove any markdown formatting)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return res.status(500).json({ 
        message: "Error processing bank statement. Please try again or upload a clearer statement." 
      });
    }

    // Validate parsed data
    if (!parsedData.transactions || !Array.isArray(parsedData.transactions)) {
      return res.status(500).json({ 
        message: "Could not extract transactions from the statement. Please try again." 
      });
    }

    // Process each transaction
    const processedTransactions = [];
    for (const transaction of parsedData.transactions) {
      try {
        if (transaction.type === 'credit') {
          // Create income record
          const incomeData = {
            title: transaction.description,
            ammount: Math.abs(transaction.amount),
            category: transaction.category,
            transactionDate: transaction.date,
            user: userId,
            source: 'Bank Statement',
            confidence: transaction.confidence
          };
          
          const newIncome = await Income.create(incomeData);
          processedTransactions.push({
            type: 'income',
            data: newIncome,
            original: transaction
          });
        } else if (transaction.type === 'debit') {
          // Create expense record
          const expenseData = {
            title: transaction.description,
            ammount: Math.abs(transaction.amount),
            category: transaction.category,
            transactionDate: transaction.date,
            user: userId,
            source: 'Bank Statement',
            confidence: transaction.confidence
          };
          
          const newExpense = await Expense.create(expenseData);
          processedTransactions.push({
            type: 'expense',
            data: newExpense,
            original: transaction
          });
        }
      } catch (error) {
        console.error(`Error processing transaction: ${transaction.description}`, error);
        // Continue with other transactions
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Return processed results
    res.status(200).json({
      message: "Bank statement processed successfully",
      summary: parsedData.summary,
      processedCount: processedTransactions.length,
      transactions: processedTransactions,
      totalCredits: parsedData.summary?.totalCredits || 0,
      totalDebits: parsedData.summary?.totalDebits || 0
    });

  } catch (error) {
    console.error("Error processing bank statement:", error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    // Provide specific error messages based on error type
    let userMessage = "Error processing bank statement. Please try again.";
    let statusCode = 500;

    if (error.message.includes('corrupted') || error.message.includes('structural issues')) {
      userMessage = "The PDF file appears to be corrupted or has structural issues. Please try uploading a different PDF file or contact your bank for a new statement.";
      statusCode = 400;
    } else if (error.message.includes('password-protected')) {
      userMessage = "The PDF file appears to be password-protected. Please remove the password protection and try again.";
      statusCode = 400;
    } else if (error.message.includes('Invalid PDF')) {
      userMessage = "The uploaded file is not a valid PDF. Please ensure you're uploading a PDF bank statement.";
      statusCode = 400;
    } else if (error.message.includes('No text content found')) {
      userMessage = "No readable text could be extracted from the PDF. This might be a scanned document or image-based PDF. Please try uploading a text-based PDF statement.";
      statusCode = 400;
    } else if (error.message.includes('AI response')) {
      userMessage = "The statement was processed but the AI analysis failed. Please try again or upload a clearer statement.";
      statusCode = 500;
    }

    res.status(statusCode).json({ 
      message: userMessage,
      error: error.message,
      suggestion: "If the problem persists, try downloading a fresh statement from your bank's website or contact support."
    });
  }
});

// Get processing status (for future use)
const getProcessingStatus = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get recent bank statement transactions
    const recentIncomes = await Income.find({ 
      user: userId, 
      source: 'Bank Statement' 
    }).sort({ createdAt: -1 }).limit(10);
    
    const recentExpenses = await Expense.find({ 
      user: userId, 
      source: 'Bank Statement' 
    }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      recentIncomes,
      recentExpenses,
      totalProcessed: recentIncomes.length + recentExpenses.length
    });

  } catch (error) {
    console.error("Error getting processing status:", error);
    res.status(500).json({ 
      message: "Error retrieving processing status",
      error: error.message 
    });
  }
});

module.exports = {
  processBankStatement,
  getProcessingStatus,
  upload
};
