const express = require("express")
require("dotenv").config()

const cors = require("cors")
const colors = require("colors")
const connectDb = require("./db_config/db_config")
const errorHandler = require("./Middlewares/errorHandler")

const PORT = process.env.PORT || 3000
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Security headers middleware
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Allow all cross origins for development/testing
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Firebase-Auth-Token',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
}))

console.log('CORS: All origins allowed');

// Handle preflight requests
app.options('*', cors())

//db connection
connectDb()

//Default Routes
app.get("/" , (req , res) => {

    res.json({
        msg : "Expense Tracker API is live"
    })

})

//Auth routes
app.use("/api/auth" , require("./Routes/authRoutes"))

//Income Routes
app.use("/api/income" , require("./Routes/incomeRoutes") )

//Expense Routes
app.use("/api/expense" , require("./Routes/expenseRoutes") )

//Fincance Routes 
app.use("/api/finance" , require("./Routes/financeRoutes") )

//AI ROutes
app.use("/api/ai", require("./Routes/aiRoutes"));

//Image processing routes
app.use("/api/image", require("./Routes/imageRoutes"));

//Income image processing routes
app.use("/api/income-image", require("./Routes/incomeImageRoutes"));

//Bank statement processing routes
app.use("/api/bank-statement", require("./Routes/bankStatementRoutes"));

//Challenge routes
app.use("/api/challenges", require("./Routes/challengeRoutes"));

//Error handler
app.use(errorHandler)

app.listen(PORT , () => {
    console.log(`Server is running at port : ${PORT}`.bgCyan)
})
