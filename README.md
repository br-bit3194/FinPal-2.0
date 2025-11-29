
# FinPal - Smart Finance Management Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React Version" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Backend" />
  <img src="https://img.shields.io/badge/MongoDB-Database-orange?style=for-the-badge&logo=mongodb" alt="Database" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google" alt="AI Powered" />
</div>

## 🚀 Overview

FinPal is a comprehensive, AI-powered finance management web application that helps users take full control of their financial life. With its intelligent features, interactive visualizations, gamified challenges, and smart AI assistant, FinPal transforms financial management into an engaging and insightful experience.

## 🎥 Demo
[![FinPal Demo](https://img.youtube.com/vi/RmGoMQ4t064/0.jpg)](https://www.youtube.com/watch?v=RmGoMQ4t064)


## ✨ Core Features

### 💰 **Financial Management**
- **Income Tracking** - Monitor all income sources with detailed categorization
- **Expense Management** - Track expenses across multiple categories with smart organization
- **Transaction History** - Complete audit trail of all financial activities
- **Real-time Updates** - Instant synchronization across all devices
- **Data Export** - Download financial reports in CSV format for record-keeping

### 📊 **Advanced Analytics & Visualization**
- **Interactive Charts** - Multiple chart types using Chart.js and Recharts
  - Line charts for income/expense trends
  - Bar charts for monthly comparisons
  - Pie charts for category breakdowns
  - Combined charts for comprehensive analysis
- **Monthly Trends** - Visual representation of financial patterns over time
- **Category Analysis** - Deep insights into spending and earning patterns
- **Performance Metrics** - Key financial indicators and ratios

### 🤖 **AI-Powered FinSight Assistant**
- **Automated Report Generation** - AI-generated monthly financial reports with insights
- **Personalized Saving Planner** - Customized financial advice and saving strategies
- **Intelligent Chat Assistant** - Real-time financial guidance and Q&A
- **Pattern Recognition** - AI-powered detection of recurring transactions and spending habits
- **Smart Recommendations** - Personalized financial tips based on user behavior

### 📱 **Smart Image Processing**
- **Receipt Scanning** - Upload and automatically extract data from receipts
- **Income Document Processing** - Process income-related documents and images
- **Bank Statement Analysis** - PDF upload and automatic transaction extraction
- **OCR Technology** - Advanced text recognition for various document types
- **Data Validation** - Intelligent error checking and data verification

### 🎯 **Gamified Challenges System**
- **Personalized Challenges** - AI-generated financial goals based on user patterns
- **Achievement System** - Unlock badges and rewards for financial milestones
- **Streak Tracking** - Maintain consistent financial habits with streak counters
- **Progress Monitoring** - Visual progress rings and achievement tracking
- **Custom Challenges** - Create personal financial goals and challenges

### 🔐 **Security & Authentication**
- **Firebase Authentication** - Secure user registration and login
- **JWT Token Management** - Secure API communication
- **Private Routes** - Protected access to sensitive financial data
- **Data Encryption** - Secure storage and transmission of financial information

### 📱 **User Experience Features**
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Framer Motion** - Engaging animations and transitions
- **Dark/Light Mode** - Customizable theme preferences
- **Accessibility** - WCAG compliant design for all users

## 🛠️ Technical Stack

### **Frontend**
- **React 19.1.0** - Latest React with modern hooks and features
- **Redux Toolkit** - State management with RTK Query
- **TailwindCSS 4.1.11** - Utility-first CSS framework
- **Chart.js & Recharts** - Interactive data visualization
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **React Router DOM** - Client-side routing

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### **AI & Machine Learning**
- **Google Gemini AI** - Advanced AI model for financial insights
- **Pattern Detection** - Intelligent transaction pattern recognition
- **Natural Language Processing** - AI chat and report generation
- **Smart Caching** - Optimized AI response handling

### **Development Tools**
- **Vite** - Fast build tool and dev server
- **ESLint** - Code quality and consistency
- **Git** - Version control system

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Google Gemini API key

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/br-bit3194/FinPal.git
cd FinPal

# Install dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Setup
Create `.env` files in the client directory 
and root directory Finpal_Main/:

**Server (.env)**
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

**Client (.env)**
```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_MEASUREMENT_ID=""

```

### Run the Application
```bash
# Terminal 1 - Start the server
cd server
npm install
npm start

# Terminal 2 - Start the client
cd client
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📁 Project Structure

```
FinPal/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── features/      # Redux slices and services
│   │   ├── api/           # API service functions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                 # Node.js backend application
│   ├── Controllers/       # Request handlers
│   ├── Models/            # Database models
│   ├── Routes/            # API endpoints
│   ├── Services/          # Business logic
│   └── Middlewares/       # Custom middleware
└── docs/                  # Documentation files
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Financial Management
- `GET /api/income` - Get all income records
- `POST /api/income` - Add new income
- `GET /api/expense` - Get all expense records
- `POST /api/expense` - Add new expense
- `GET /api/finance` - Get financial summaries

### AI Services
- `POST /api/ai/report` - Generate AI financial report
- `POST /api/ai/plan` - Get personalized saving plan
- `POST /api/ai/chat` - AI chat assistance

### Image Processing
- `POST /api/image/process` - Process receipt images
- `POST /api/income-image/process` - Process income documents
- `POST /api/bank-statement/process` - Process bank statements

### Challenges
- `GET /api/challenges` - Get user challenges
- `POST /api/challenges` - Create new challenge
- `PUT /api/challenges/:id` - Update challenge progress

## 🎯 Key Features in Detail

### **AI Pattern Detection System**
- **Hybrid Intelligence**: Combines database caching with AI analysis
- **Real-time Updates**: Patterns update immediately with new transactions
- **Smart Categorization**: Automatic category suggestions based on transaction history
- **Confidence Scoring**: AI confidence levels for pattern reliability
- **Frequency Analysis**: Detects daily, weekly, monthly, and yearly patterns

### **Advanced Charting System**
- **Multiple Chart Types**: Line, bar, pie, and combined charts
- **Interactive Elements**: Hover effects, zoom, and filtering
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Data**: Live updates as transactions are added

### **Gamification Features**
- **Achievement System**: Unlock badges for financial milestones
- **Streak Tracking**: Maintain consistent habits with visual progress
- **Personalized Challenges**: AI-generated goals based on user behavior
- **Progress Visualization**: Beautiful progress rings and achievement cards

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent financial insights
- **Chart.js & Recharts** for beautiful data visualization
- **TailwindCSS** for the modern, responsive design system
- **Framer Motion** for smooth animations and transitions

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check our documentation in the `docs/` folder

---

<div align="center">
  <strong>Built with ❤️ for better financial management</strong>
</div>
