import React, { useState } from 'react';
import { TrendingUp, DollarSign, CreditCard, Eye, Plus, BarChart3 , Calendar, Activity, Clock, PieChartIcon, IndianRupee, Camera, FileText, Repeat, Wifi, Home, Car, ShoppingBag, Utensils, Bus, Heart, Building, Brain, Loader2, Trophy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addIncome, getAllIncomes } from '../features/income/incomeSlice';
import { addExpense, getAllExpenses } from '../features/expense/expenseSlice';
import { toast } from 'react-toastify';
import { getallTransactions } from '../features/transaction/transactionSlice';
import PieChart from '../components/DashboardComponents/PieChart';
import BarChart from '../components/DashboardComponents/BarChart';
import CombinedLineChart from '../components/DashboardComponents/CombinedLineChart';
import MonthlyBarChart from '../components/DashboardComponents/MonthlyBarChart';
import ImageUpload from '../components/ImageUpload';
import BankStatementUpload from '../components/BankStatementUpload';
import IncomeUpload from '../components/IncomeUpload';
import dayjs from "dayjs";
import aiService from '../features/ai/aiService';

const Dashboard = () => {
  const navigate = useNavigate();
  // useSelector hooks MUST be at the very top
  const {allIncomes , isLoading , isSuccess} = useSelector(state => state.income);
  const {allExpenses } = useSelector(state => state.expense);
  const {transactions} = useSelector(state => state.transaction);

  // Monthly Income Trend Data - Fixed implementation
  const getCurrentMonthIncomeData = (allIncomes) => {
    if (!Array.isArray(allIncomes) || allIncomes.length === 0) {
      return { labels: [], values: [] };
    }
    
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    
    // Filter for this month's incomes - use transactionDate if available, fallback to createdAt
    const filtered = allIncomes.filter((income) => {
      const date = income.transactionDate ? dayjs(income.transactionDate) : dayjs(income.createdAt);
      return date.month() === currentMonth && date.year() === currentYear;
    });
    
    if (filtered.length === 0) {
      return { labels: [], values: [] };
    }
    
    // Create map of days with totals for the entire month
    const dailyIncome = {};
    const daysInMonth = dayjs().daysInMonth();
    
    for (let i = 1; i <= daysInMonth; i++) {
      dailyIncome[i] = 0;
    }
    
    filtered.forEach((income) => {
      const date = income.transactionDate ? dayjs(income.transactionDate) : dayjs(income.createdAt);
      const day = date.date();
      if (day >= 1 && day <= daysInMonth) {
        dailyIncome[day] += Number(income.ammount) || 0;
      }
    });
    
    const labels = Object.keys(dailyIncome).map((day) => `${day}`);
    const values = Object.values(dailyIncome);
    
    return { labels, values };
  };

  // Monthly Expense Trend Data - Fixed implementation
  const getCurrentMonthExpenseData = (allExpenses) => {
    if (!Array.isArray(allExpenses) || allExpenses.length === 0) {
      return { labels: [], values: [] };
    }
    
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    
    // Filter for this month's expenses - use transactionDate if available, fallback to createdAt
    const filtered = allExpenses.filter((expense) => {
      const date = expense.transactionDate ? dayjs(expense.transactionDate) : dayjs(expense.createdAt);
      return date.month() === currentMonth && date.year() === currentYear;
    });
    
    if (filtered.length === 0) {
      return { labels: [], values: [] };
    }
    
    // Create map of days with totals for the entire month
    const dailyExpense = {};
    const daysInMonth = dayjs().daysInMonth();
    
    for (let i = 1; i <= daysInMonth; i++) {
      dailyExpense[i] = 0;
    }
    
    filtered.forEach((expense) => {
      const date = expense.transactionDate ? dayjs(expense.transactionDate) : dayjs(expense.createdAt);
      const day = date.date();
      if (day >= 1 && day <= daysInMonth) {
        dailyExpense[day] += Number(expense.ammount) || 0;
      }
    });
    
    const labels = Object.keys(dailyExpense).map((day) => `${day}`);
    const values = Object.values(dailyExpense);
    
    return { labels, values };
  };

  const { labels: incomeLabels, values: incomeValues } = getCurrentMonthIncomeData(allIncomes);
  const { labels: expenseLabels, values: expenseValues } = getCurrentMonthExpenseData(allExpenses);

  // This Year Monthly Income & Expense Data
  const getThisYearMonthlyData = () => {
    const currentYear = dayjs().year();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyIncome = {};
    const monthlyExpense = {};
    
    // Initialize all months with 0
    months.forEach((month, index) => {
      monthlyIncome[index] = 0;
      monthlyExpense[index] = 0;
    });
    
    // Calculate monthly income totals
    if (Array.isArray(allIncomes)) {
      allIncomes.forEach((income) => {
        const date = income.transactionDate ? dayjs(income.transactionDate) : dayjs(income.createdAt);
        if (date.year() === currentYear) {
          const monthIndex = date.month();
          monthlyIncome[monthIndex] += Number(income.ammount) || 0;
        }
      });
    }
    
    // Calculate monthly expense totals
    if (Array.isArray(allExpenses)) {
      allExpenses.forEach((expense) => {
        const date = expense.transactionDate ? dayjs(expense.transactionDate) : dayjs(expense.createdAt);
        if (date.year() === currentYear) {
          const monthIndex = date.month();
          monthlyExpense[monthIndex] += Number(expense.ammount) || 0;
        }
      });
    }
    
    return {
      labels: months,
      incomeValues: months.map((_, index) => monthlyIncome[index]),
      expenseValues: months.map((_, index) => monthlyExpense[index])
    };
  };
  
  // Get synchronized data for both income and expense - Fixed implementation
  const getSynchronizedChartData = () => {
    const incomeData = getCurrentMonthIncomeData(allIncomes);
    const expenseData = getCurrentMonthExpenseData(allExpenses);
    
    console.log('=== Monthly Trend Chart Data ===');
    console.log('Income Data:', incomeData);
    console.log('Expense Data:', expenseData);
    
    // Create synchronized labels (1 to 31 for month)
    const labels = [];
    const daysInMonth = dayjs().daysInMonth();
    
    for (let i = 1; i <= daysInMonth; i++) {
      labels.push(`${i}`);
    }
    
    // Create synchronized values arrays
    const incomeValues = new Array(daysInMonth).fill(0);
    const expenseValues = new Array(daysInMonth).fill(0);
    
    // Fill income values
    incomeData.labels.forEach((day, index) => {
      const dayNum = parseInt(day);
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        incomeValues[dayNum - 1] = incomeData.values[index] || 0;
      }
    });
    
    // Fill expense values
    expenseData.labels.forEach((day, index) => {
      const dayNum = parseInt(day);
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        expenseValues[dayNum - 1] = expenseData.values[index] || 0;
      }
    });
    
    const result = { labels, incomeValues, expenseValues };
    console.log('Final Synchronized Chart Data:', result);
    
    return result;
  };

       const [isOpenIncome, setIsOpenIncome] = useState(false);
    const [isOpenExpense, setIsOpenExpense] = useState(false);
    const [isOptionModal, setIsOptionModal] = useState(false);
    const [modalType, setModalType] = useState('income'); // 'income' or 'expense'
    const [isImageUploadModal, setIsImageUploadModal] = useState(false);
    const [isBankStatementModal, setIsBankStatementModal] = useState(false);
    
    // Income page modal states
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);
   
  // AI-Powered Recurrent Transactions State
  const [recurrentTransactions, setRecurrentTransactions] = useState([]);
  const [isLoadingPatterns, setIsLoadingPatterns] = useState(false);
  const [lastPatternUpdate, setLastPatternUpdate] = useState(null);
  const [hasShownInitialNotification, setHasShownInitialNotification] = useState(false);
  const [lastTransactionCount, setLastTransactionCount] = useState(0);

       const [formData , setFormData] = useState({
     title : '' , 
     ammount : '' , 
     category : 'salary',
     transactionDate: new Date().toISOString().split('T')[0]
    })

  //  const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const handleInputChange = (e) => {

    const {name , value} = e.target 
    setFormData(prev => ({
      ...prev ,
      [name] : value
    }))

  }

  const toggleModal = () => {
    setIsOpenIncome(!isOpenIncome);
    // Reset form data to default values when opening modal
    if (!isOpenIncome) {
      setFormData({
        title: '',
        ammount: '',
        category: 'salary',
        transactionDate: new Date().toISOString().split('T')[0]
      });
    }
  };
  const toggleModalExp = () => {
    setIsOpenExpense(!isOpenExpense);
    // Reset form data to default values when opening modal
    if (!isOpenExpense) {
      setFormData({
        title: '',
        ammount: '',
        category: 'food',
        transactionDate: new Date().toISOString().split('T')[0]
      });
    }
  };
  const toggleOptionModal = () => setIsOptionModal(!isOptionModal);
  const toggleImageUploadModal = () => setIsImageUploadModal(!isImageUploadModal);
  const toggleBankStatementModal = () => setIsBankStatementModal(!isBankStatementModal);
  const closeModal = () => {
    setIsOpenIncome(false);
    setIsOpenExpense(false);
    // Reset form data to default values
    setFormData({
      title: '',
      ammount: '',
      category: 'salary',
      transactionDate: new Date().toISOString().split('T')[0]
    });
  };
  const closeOptionModal = () => {setIsOptionModal(false)};
  const closeImageUploadModal = () => {setIsImageUploadModal(false)};
  const closeBankStatementModal = () => {setIsBankStatementModal(false)};
  
  // Income page modal functions
  const toggleIncomeModal = () => setIsOpenModal(!isOpenModal);
  const closeIncomeModal = () => {
    setIsOpenModal(false);
    setIsEdit(false);
    setFormData({
      title: '',
      ammount: '',
      category: 'salary',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setSelectedIncome(null);
  };

  const handleManualEntry = () => {
    setIsOptionModal(false);
    // Reset form data with proper transaction date for income
    setFormData({
      title: '',
      ammount: '',
      category: 'salary',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setIsOpenIncome(true);
  };

  const handleExpenseManualEntry = () => {
    setIsOptionModal(false);
    // Reset form data with proper transaction date for expense
    setFormData({
      title: '',
      ammount: '',
      category: 'food',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setIsOpenExpense(true);
  };

  const handleReceiptUpload = () => {
    setIsOptionModal(false);
    toggleImageUploadModal();
  };

  const handleIncomeReceiptUpload = () => {
    setIsOptionModal(false);
    toggleImageUploadModal();
  };

  const handleImageDataExtracted = async (data) => {
    try {
      // Prepare the data for database insertion
      const expenseData = {
        title: data.title || '',
        ammount: data.amount || '',
        category: data.category || '',
        transactionDate: new Date().toISOString().split('T')[0]
      };

      // Add the expense directly to database
      await dispatch(addExpense(expenseData));
      setRender(!render);
      setIsImageUploadModal(false);
      toast.success("Expense added from receipt!");
      
      // Reset form data
      setFormData({
        title: '',
        ammount: '',
        category: '',
        transactionDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error("Failed to add expense from receipt");
    }
  };

  const handleIncomeImageDataExtracted = async (data) => {
    try {
      // Prepare the data for database insertion
      const incomeData = {
        title: data.title || '',
        ammount: data.amount || '',
        category: data.category || 'salary',
        transactionDate: new Date().toISOString().split('T')[0]
      };

      // Add the income directly to database
      await dispatch(addIncome(incomeData));
      setRender(!render);
      setIsImageUploadModal(false);
      toast.success("Income added from receipt!");
      
      // Reset form data
      setFormData({
        title: '',
        ammount: '',
        category: 'salary',
        transactionDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error("Failed to add income from receipt");
    }
  };

  const [render , setRender] = useState(false)
  // const [last30DaysExpense , setLast30DaysExpense] = useState([{
  //   date : '' , 
  //   ammount : ''
  // }])

  const dispatch = useDispatch()

  // Function to detect recurring patterns using AI
  const detectRecurringPatterns = async (showNotification = true) => {
    if (transactions?.length === 0) return;
    
    // Prevent duplicate calls if already loading
    if (isLoadingPatterns) return;
    
    setIsLoadingPatterns(true);
    try {
      // Try to get cached patterns first (fastest)
      let patterns = await aiService.getCachedPatterns();
      
      if (patterns.length === 0) {
        // If no cached patterns, run full AI analysis
        patterns = await aiService.detectRecurringPatterns();
      }
      
      // Transform AI response to match our UI structure and filter out irregular patterns
      const transformedPatterns = patterns
        .filter(pattern => {
          // Only include patterns with recognizable frequency
          const frequency = pattern.frequency?.toLowerCase();
          const confidence = pattern.confidence || 0;
          
          // Filter out patterns that are irregular, uncertain, or have low confidence
          if (!frequency || frequency === 'irregular' || frequency === 'uncertain' || frequency === 'unknown') {
            return false;
          }
          
          // Filter out patterns with very low confidence (below 0.4)
          if (confidence < 0.4) {
            return false;
          }
          
          // Only include patterns with standard frequencies
          const validFrequencies = ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'];
          return validFrequencies.includes(frequency);
        })
        .map(pattern => {
          // Ensure nextExpected is always present and properly formatted
          let nextExpected = pattern.next_expected;
          
          // If AI didn't provide next_expected, calculate it based on frequency
          if (!nextExpected && pattern.frequency) {
            const now = new Date();
            let calculatedDate = new Date(now);
            
            switch (pattern.frequency.toLowerCase()) {
              case 'daily':
                calculatedDate.setDate(calculatedDate.getDate() + 1);
                break;
              case 'weekly':
                calculatedDate.setDate(calculatedDate.getDate() + 7);
                break;
              case 'bi-weekly':
                calculatedDate.setDate(calculatedDate.getDate() + 14);
                break;
              case 'monthly':
                calculatedDate.setMonth(calculatedDate.getMonth() + 1);
                break;
              case 'quarterly':
                calculatedDate.setMonth(calculatedDate.getMonth() + 3);
                break;
              case 'yearly':
                calculatedDate.setFullYear(calculatedDate.getFullYear() + 1);
                break;
              default:
                calculatedDate.setMonth(calculatedDate.getMonth() + 1); // Default to monthly
            }
            
            nextExpected = calculatedDate.toLocaleDateString('en-GB');
          }
          
          // Fallback if still no nextExpected
          if (!nextExpected) {
            const fallbackDate = new Date();
            fallbackDate.setMonth(fallbackDate.getMonth() + 1);
            nextExpected = fallbackDate.toLocaleDateString('en-GB');
          }
          
          return {
            id: pattern.id || Date.now() + Math.random(),
            title: pattern.title,
            amount: pattern.amount,
            type: pattern.type,
            category: pattern.category,
            frequency: pattern.frequency,
            confidence: pattern.confidence,
            patternReason: pattern.pattern_reason,
            lastOccurrence: pattern.last_occurrence,
            nextExpected: nextExpected,
            icon: getIconForCategory(pattern.category),
            color: getColorForCategory(pattern.category)
          };
        });
      
      setRecurrentTransactions(transformedPatterns);
      setLastPatternUpdate(new Date());
      
      // Only show notification if explicitly requested and it's not the initial load
      if (showNotification && hasShownInitialNotification) {
        toast.success("Patterns detected successfully!");
      }
      
      // Mark that we've shown the initial notification
      if (!hasShownInitialNotification) {
        setHasShownInitialNotification(true);
      }
    } catch (error) {
      console.error('Pattern Detection failed:', error);
      if (showNotification) {
        toast.error("Failed to detect patterns. Using fallback data.");
      }
      // Fallback to basic pattern detection
      setRecurrentTransactions(getFallbackPatterns());
    } finally {
      setIsLoadingPatterns(false);
    }
  };

  // Quick pattern update when new transaction is added
  const updatePatternsQuickly = async (transaction) => {
    try {
      const result = await aiService.updatePatternsWithTransaction(transaction);
      
      if (result.updated || result.created) {
        // Refresh patterns to show updated data
        setTimeout(() => {
          detectRecurringPatterns();
        }, 500);
      }
    } catch (error) {
      console.error('Quick pattern update failed:', error);
      // Fallback to full refresh
      setTimeout(() => {
        detectRecurringPatterns();
      }, 1000);
    }
  };

  // Fallback pattern detection when AI fails
  const getFallbackPatterns = () => {
    if (!transactions || transactions.length === 0) return [];
    
    const patterns = [];
    const seenTitles = new Set();
    
    transactions.forEach(transaction => {
      const title = transaction.isIncome ? transaction.income?.title : transaction.expense?.title;
      const amount = transaction.isIncome ? transaction.income?.ammount : transaction.expense?.ammount;
      const category = transaction.expense?.category || 'others';
      
      if (title && !seenTitles.has(title.toLowerCase())) {
        seenTitles.add(title.toLowerCase());
        
        // Calculate next expected date based on frequency
        const now = new Date();
        let nextExpected;
        let frequency;
        
        // Try to determine frequency from transaction history
        const similarTransactions = transactions.filter(t => {
          const tTitle = t.isIncome ? t.income?.title : t.expense?.title;
          return tTitle && tTitle.toLowerCase() === title.toLowerCase();
        });
        
        // Only create patterns if we have enough data points (at least 3 transactions)
        if (similarTransactions.length >= 3) {
          // Calculate average interval between transactions
          const sortedDates = similarTransactions
            .map(t => new Date(t.createdAt))
            .sort((a, b) => a - b);
          
          let totalInterval = 0;
          for (let i = 1; i < sortedDates.length; i++) {
            totalInterval += sortedDates[i] - sortedDates[i - 1];
          }
          
          const avgInterval = totalInterval / (sortedDates.length - 1);
          const avgDays = Math.round(avgInterval / (1000 * 60 * 60 * 24));
          
          if (avgDays <= 7) {
            frequency = 'weekly';
            nextExpected = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          } else if (avgDays <= 14) {
            frequency = 'bi-weekly';
            nextExpected = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          } else if (avgDays <= 31) {
            frequency = 'monthly';
            nextExpected = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          } else if (avgDays <= 90) {
            frequency = 'quarterly';
            nextExpected = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
          } else {
            frequency = 'yearly';
            nextExpected = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          }
        } else {
          // Default to monthly if no pattern detected
          frequency = 'monthly';
          nextExpected = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
        
        // Ensure nextExpected is always a valid date string
        const nextExpectedFormatted = nextExpected && !isNaN(nextExpected.getTime()) 
          ? nextExpected.toLocaleDateString('en-GB') 
          : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');
        
        patterns.push({
          id: Date.now() + Math.random(),
          title: title,
          amount: amount,
          type: transaction.isIncome ? 'income' : 'expense',
          category: category,
          frequency: frequency,
          confidence: 0.6,
          patternReason: 'Basic pattern detection',
          lastOccurrence: new Date().toLocaleDateString('en-GB'),
          nextExpected: nextExpectedFormatted,
          icon: getIconForCategory(category),
          color: getColorForCategory(category)
        });
      }
    });
    
    const limitedPatterns = patterns.slice(0, 10); // Limit fallback patterns
    console.log('Fallback patterns generated:', limitedPatterns);
    return limitedPatterns;
  };

  // Helper function to get icon for category
  const getIconForCategory = (category) => {
    const iconMap = {
      'food': Utensils,
      'rent': Home,
      'travel': Bus,
      'entertainment': Eye,
      'shopping': ShoppingBag,
      'bills': Wifi,
      'emi': Car,
      'transport': Bus,
      'charity': Heart,
      'investment': TrendingUp,
      'transfer': Heart,
      'freelance': DollarSign,
      'health': Activity,
      'salary': DollarSign,
      'others': CreditCard
    };
    return iconMap[category] || CreditCard;
  };

  // Helper function to get color for category
  const getColorForCategory = (category) => {
    const colorMap = {
      'food': 'orange',
      'rent': 'red',
      'travel': 'blue',
      'entertainment': 'purple',
      'shopping': 'pink',
      'bills': 'blue',
      'emi': 'purple',
      'transport': 'indigo',
      'charity': 'rose',
      'investment': 'emerald',
      'transfer': 'pink',
      'freelance': 'green',
      'health': 'teal',
      'salary': 'green',
      'others': 'gray'
    };
    return colorMap[category] || 'gray';
  };

  useEffect(() => {
    dispatch(getAllIncomes())
    dispatch(getAllExpenses())
    dispatch(getallTransactions())
    
  } , [dispatch, render])

  // Detect patterns when transactions change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Only run pattern detection if transaction count actually changed
      // or if this is the first time loading
      if (transactions.length !== lastTransactionCount || lastTransactionCount === 0) {
        setLastTransactionCount(transactions.length);
        detectRecurringPatterns(false); // Don't show notification on initial load
      }
    }
  }, [transactions, lastTransactionCount]);

  
  // Debug logging for data
  useEffect(() => {
    console.log('=== Dashboard Data Debug ===');
    console.log('allIncomes:', allIncomes);
    console.log('allExpenses:', allExpenses);
    console.log('transactions:', transactions);
    
    if (allIncomes && allIncomes.length > 0) {
      console.log('Sample Income:', allIncomes[0]);
      console.log('Income dates:', allIncomes.map(inc => ({ 
        id: inc._id, 
        date: inc.transactionDate || inc.createdAt, 
        amount: inc.ammount 
      })));
    }
    
    if (allExpenses && allExpenses.length > 0) {
      console.log('Sample Expense:', allExpenses[0]);
      console.log('Expense dates:', allExpenses.map(exp => ({ 
        id: exp._id, 
        date: exp.transactionDate || exp.createdAt, 
        amount: exp.ammount 
      })));
    }
  }, [allIncomes, allExpenses, transactions]);
  
  // console.log(allIncomes)
  // console.log(allExpenses)
  // console.log(transactions)
  
  const totalIncome = allIncomes?.reduce((sum , income) => sum + income?.ammount , 0)
  const totalExpense = allExpenses?.reduce((sum , income) => sum + income?.ammount , 0)
  const totalBalance = totalIncome-totalExpense
  
  // const setDetails = () => {
  //   var totalIncome = allIncomes?.reduce((sum , income) => sum + income?.ammount , 0)
  //   var totalExpense = allExpenses?.reduce((sum , income) => sum + income?.ammount , 0)
  //   var totalBalance = totalIncome-totalExpense
  // }
  
  //DATE to HOUR
  const dateToHour = (date) => {
    if (!date) return 'Unknown';
  
    try {
      const createdDate = new Date(date);
      const now = new Date();
  
      if (isNaN(createdDate.getTime())) {
        return 'Invalid date';
      }
  
      const diffMs = now - createdDate;
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30); // approx
      const years = Math.floor(days / 365); // approx
  
      if (seconds < 60) return 'Just now';
      if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
      if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
      if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
      
      return `${years} year${years === 1 ? '' : 's'} ago`;
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return 'Unknown';
    }
  };
  
  
        //SET LAST 30 DAYS EXPENSE
      const getLast30DaysExpenses = (allExpenses) => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 10);

        const filtered = allExpenses.filter(exp => {
          const dateToUse = exp.transactionDate || exp.createdAt;
          const createdAtDate = new Date(dateToUse);
          return createdAtDate >= thirtyDaysAgo && createdAtDate <= today;
        });

        return filtered;
      };

      //Group Data for barchart
      const groupByDate = (data) => {
        const map = {};

        data.forEach(exp => {
          const dateToUse = exp.transactionDate || exp.createdAt;
          const date = new Date(dateToUse);
          const label = date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });

          if (map[label]) {
            map[label] += exp.ammount;
          } else {
            map[label] = exp.ammount;
          }
        });

        return {
          labels: Object.keys(map),
          data: Object.values(map),
        };
      };

      const last10Days = getLast30DaysExpenses(allExpenses);
      const chartData = groupByDate(last10Days);

//       console.log(chartData.labels);
// console.log(chartData.data);

//Average Of Last 10 days \
const avgLast10Days = (last10Days?.reduce((sum , expense) => sum + expense?.ammount ,  0))/10

// console.log(avgLast10Days)




  //Add Income
  const handleAddIncome = async(e) => {
    e.preventDefault()
    console.log('Adding income with data:', formData)
    
    // Basic validation
    if (!formData.title || !formData.ammount || !formData.category || !formData.transactionDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const result = await dispatch(addIncome(formData))
      console.log('Income result:', result)
      setRender(!render)
      
      // Close the modal and reset form data
      setIsOpenIncome(false)
      setFormData({
        title: '',
        ammount: '',
        category: 'salary',
        transactionDate: new Date().toISOString().split('T')[0]
      })
      
      toast.success("Income Added")
      
      // Quick pattern update for new transaction
      if (result.payload) {
        const transaction = {
          user: result.payload.user,
          isIncome: true,
          income: result.payload,
          createdAt: new Date()
        };
        updatePatternsQuickly(transaction);
      }
    } catch (error) {
      console.error('Error adding income:', error)
      toast.error("Failed to add income. Please try again.")
    }
  }

  //Add EXPENSE
  const handleAddExpense = async(e) => {
    e.preventDefault()
    console.log('Adding expense with data:', formData)
    
    // Basic validation
    if (!formData.title || !formData.ammount || !formData.category || !formData.transactionDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const result = await dispatch(addExpense(formData))
      console.log('Expense result:', result)
      setRender(!render)
      // Close the modal and reset form data
      setIsOpenExpense(false)
      setFormData({
        title: '',
        ammount: '',
        category: 'food',
        transactionDate: new Date().toISOString().split('T')[0]
      })
      
      toast.success("Expense Added")
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error("Failed to add expense. Please try again.")
    }

    // Quick pattern update for new transaction
    if (result.payload) {
      const transaction = {
        user: result.payload.user,
        isIncome: false,
        expense: result.payload,
        createdAt: new Date()
      };
      updatePatternsQuickly(transaction);
    }
  }

  // Helper function to validate if a pattern is recognizable and predictable
  const isValidPattern = (pattern) => {
    const frequency = pattern.frequency?.toLowerCase();
    const confidence = pattern.confidence || 0;
    
    // Must have a valid frequency
    if (!frequency) return false;
    
    // Must not be irregular, uncertain, or unknown
    if (['irregular', 'uncertain', 'unknown', 'random', 'sporadic'].includes(frequency)) {
      return false;
    }
    
    // Must have reasonable confidence
    if (confidence < 0.4) return false;
    
    // Must have a valid frequency type
    const validFrequencies = ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'];
    if (!validFrequencies.includes(frequency)) return false;
    
    // Must have nextExpected date
    if (!pattern.nextExpected) return false;
    
    return true;
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-[#0081A7]/5 p-6 ml-0 sm:ml-0 pt-20">
             {/* Header with Quick Actions */}
      <div className="mb-8">
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
           <div className="flex-1">
             <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Welcome to <span className="text-[#0081A7]">FinPal</span> 🚀
        </h1>
             <p className="text-sm sm:text-base text-gray-600">Your command center for financial domination! Master your money, crush your goals, and build wealth like a boss! 💪💰</p>
           </div>
           
                       {/* Professional Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add Income Button */}
              <button 
                onClick={() => {setModalType('income'); setIsOptionModal(true);}} 
                className="px-6 py-3 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-xl hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Income
              </button>

              {/* Add Expense Button */}
              <button 
                onClick={() => {setModalType('expense'); setIsOptionModal(true);}} 
                className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl hover:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:-translate-y-1 border-0 overflow-hidden min-w-[140px] h-[52px]"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                  <div className="w-6 h-6 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-white text-sm block leading-tight">Add Expense</span>
                  </div>
                </div>
              </button>

              {/* Add Bank Statement Button */}
              <button 
                onClick={toggleBankStatementModal} 
                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl hover:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:-translate-y-1 border-0 overflow-hidden min-w-[140px] h-[52px]"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                  <div className="w-6 h-6 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-white text-sm block leading-tight">Bank Statement</span>
                  </div>
                </div>
              </button>

              {/* Challenges Button */}
              <button 
                onClick={() => navigate('/dashboard/challenges')} 
                className="group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl hover:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-1 border-0 overflow-hidden min-w-[140px] h-[52px]"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                  <div className="w-6 h-6 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-white text-sm block leading-tight">Challenges</span>
                  </div>
                </div>
              </button>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-xl group-hover:from-[#0081A7]/20 group-hover:to-[#00B4D8]/20 transition-all duration-300 border border-[#0081A7]/20">
                <TrendingUp className="w-6 h-6 text-[#0081A7]" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
                <p className="text-3xl font-bold text-[#0081A7]">₹{allIncomes?.reduce((sum , income) => sum + income?.ammount , 0)}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[#00B4D8] font-medium">+8.2%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0081A7] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-[#00B4D8]/10 to-[#0081A7]/10 rounded-xl group-hover:from-[#00B4D8]/20 group-hover:to-[#0081A7]/20 transition-all duration-300 border border-[#00B4D8]/20">
                <IndianRupee className="w-6 h-6 text-[#00B4D8]" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
                <p className="text-3xl font-bold text-[#00B4D8]">₹{totalBalance.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[#0081A7] font-medium">+12.5%</span>
              <span className="text-gray-500 ml-2">growth this month</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl group-hover:from-red-100 group-hover:to-pink-100 transition-all duration-300 border border-red-200/50">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-red-500 font-medium">-2.1%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI-Powered Recurrent Transactions */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#0081A7]" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">AI Pattern Detection</h3>
                <p className="text-xs text-gray-500">Smart recurring pattern analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={detectRecurringPatterns}
                disabled={isLoadingPatterns}
                className="p-1.5 bg-[#0081A7]/10 hover:bg-[#0081A7]/20 text-[#0081A7] rounded-lg transition-colors disabled:opacity-50"
                title="Refresh patterns"
              >
                <Loader2 className={`w-4 h-4 ${isLoadingPatterns ? 'animate-spin' : ''}`} />
            </button>
              <span className="text-xs bg-[#0081A7]/10 text-[#0081A7] px-2 py-1 rounded-full font-medium">
                {recurrentTransactions.length} patterns
                {recurrentTransactions.length > 0 && (
                  <span className="ml-1 text-[#0081A7]/70">
                    • {Math.round(recurrentTransactions.reduce((sum, t) => sum + (t.confidence || 0), 0) / recurrentTransactions.length * 100)}% avg confidence
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {isLoadingPatterns ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-[#0081A7] animate-spin" />
                <span className="ml-2 text-gray-600">Detecting patterns...</span>
              </div>
            ) : recurrentTransactions.length > 0 ? (
              recurrentTransactions.map((transaction) => {
                const IconComponent = transaction.icon;
                const colorClasses = {
                  'red': 'bg-red-50 border-red-200 text-red-700',
                  'green': 'bg-green-50 border-green-200 text-green-700',
                  'blue': 'bg-blue-50 border-blue-200 text-blue-700',
                  'purple': 'bg-purple-50 border-purple-200 text-purple-700',
                  'orange': 'bg-orange-50 border-orange-200 text-orange-700',
                  'yellow': 'bg-yellow-50 border-yellow-200 text-yellow-700',
                  'pink': 'bg-pink-50 border-pink-200 text-pink-700',
                  'indigo': 'bg-indigo-50 border-indigo-200 text-indigo-700',
                  'rose': 'bg-rose-50 border-rose-200 text-rose-700',
                  'amber': 'bg-amber-50 border-amber-200 text-amber-700',
                  'emerald': 'bg-emerald-50 border-emerald-200 text-emerald-700',
                  'teal': 'bg-teal-50 border-teal-200 text-teal-700',
                  'violet': 'bg-violet-50 border-violet-200 text-violet-700',
                  'gray': 'bg-gray-50 border-gray-200 text-gray-700'
                };
                
                                 return (
                   <div key={transaction.id} className={`p-3 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-md ${colorClasses[transaction.color]}`}>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                           <IconComponent className={`w-4 h-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <p className="text-sm font-medium text-gray-800">{transaction.title}</p>
                             {transaction.confidence && (
                               <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                 {Math.round(transaction.confidence * 100)}% AI
                               </span>
                             )}
                           </div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                               {transaction.frequency}
                             </span>
                             <span className="text-xs text-gray-500 capitalize">• {transaction.category}</span>
                           </div>
                           {transaction.patternReason && (
                             <p className="text-xs text-gray-500 italic">{transaction.patternReason}</p>
                           )}
                         </div>
                       </div>
                       <div className="text-right">
                         <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                           {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                         </p>
                         {transaction.nextExpected && (
                           <p className="text-xs text-gray-500 mt-1">Next: {transaction.nextExpected}</p>
                         )}
                       </div>
                     </div>
                   </div>
                 );
              })
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-8 bg-gradient-to-br from-gray-50/50 to-gray-100/50 border border-gray-200 rounded-xl">
                <Brain className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-600 mb-1">No Patterns Detected Yet</h4>
                  <p className="text-sm text-gray-500">AI will analyze your transactions to find recurring patterns</p>
                  <button 
                    onClick={detectRecurringPatterns}
                    disabled={isLoadingPatterns}
                    className="mt-3 px-4 py-2 bg-[#0081A7] text-white rounded-lg hover:bg-[#0081A7]/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isLoadingPatterns ? 'Analyzing...' : 'Analyze Patterns'}
            </button>
                </div>
              </div>
            )}
            {lastPatternUpdate && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last analyzed: {lastPatternUpdate.toLocaleString()}</span>
                  <span className="text-[#0081A7]">Powered by Gemini AI</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Overview - Pie Chart */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
               <PieChartIcon className="w-5 h-5 text-[#0081A7]" />
               <div>
                 <h3 className="text-xl font-semibold text-gray-800">Financial Overview</h3>
                 <p className="text-xs text-gray-500">Income, Expenses & Balance distribution</p>
               </div>
             </div>
           </div>
           
           <div className="flex justify-center">
            {
              totalIncome ? ( <PieChart income={totalIncome} expenses={totalExpense} balance={totalBalance} />
)
                          : (
                            <div className="h-48 w-100 bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 rounded-lg flex items-center justify-center border border-[#0081A7]/10">
                              <div className="text-center">
                                <PieChartIcon className="w-12 h-12 text-[#0081A7] mx-auto mb-2" />
                                <div className="text-[#0081A7] text-sm font-medium">Pie Chart</div>
                                <div className="text-gray-500 text-xs">Add Income/Expense to visualize the data</div>
                              </div>
                            </div>
                          )
            }
          </div>
          
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
            <Activity className="w-5 h-5 text-[#0081A7]" />
          </div>
          <div className="space-y-3">
            {

              transactions?.length > 0 ? (
                transactions.slice(0 , 5).map((transaction) => {
                    return (
                      transaction.isIncome ? (
                         <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#0081A7]/5 to-[#00B4D8]/5 rounded-lg hover:from-[#0081A7]/10 hover:to-[#00B4D8]/10 transition-all duration-200 border border-[#0081A7]/10">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-[#00B4D8] rounded-full mr-3"></div>
                            <span className="text-sm text-gray-700 font-medium">{transaction?.income?.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-[#00B4D8]">+₹{transaction?.income?.ammount}</span>
                        </div>
                      )
                      : (
                        <div className="flex items-center justify-between p-3 bg-red-50/80 rounded-lg hover:bg-red-50 transition-colors duration-200 border border-red-100">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-700 font-medium">{transaction?.expense?.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-red-600">-₹{transaction?.expense?.ammount}</span>
                        </div>
                      )
                       
                    )
                })
              )
              : (<div className="flex flex-col items-center justify-center gap-2 p-6 bg-red-50/50 border border-red-200 rounded-xl shadow-sm">
                  <Activity className="w-8 h-8 text-red-400" />
                  <h1 className="text-xl font-semibold text-gray-700">No Recent Activity yet</h1>
                  <p className="text-sm text-gray-500">Start Adding your transaction to see them here.</p>
                </div>)

            }
            
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Expenses</h3>
            <Clock className="w-5 h-5 text-[#0081A7]" />
          </div>
          <div className="space-y-3">
            {
              allExpenses?.length>0 ? allExpenses?.slice(0,4).map((expense) => {
                return(
                  <div key={expense._id} className="flex items-center justify-between p-3 bg-red-50/80 rounded-lg hover:bg-red-50 transition-colors duration-200 border border-red-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <CreditCard className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{expense?.title}</p>
                        <p className="text-xs text-gray-500">
                          {expense?.transactionDate ? dateToHour(expense.transactionDate) : dateToHour(expense?.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-600">-₹{expense?.ammount}</span>
                  </div>
                )
              }) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 bg-red-50/50 border border-red-200 rounded-xl shadow-sm">
                  <CreditCard className="w-8 h-8 text-red-400" />
                  <h1 className="text-xl font-semibold text-gray-700">No transaction yet</h1>
                  <p className="text-sm text-gray-500">Start adding your expenses to see them here.</p>
                </div>
              )
            }
          </div>
        </div>

        {/* Last 10 Days Expenses - Bar Chart */}
<div className="group bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-200/50 overflow-hidden relative">
  {/* Subtle gradient overlay on hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <div className="relative z-10">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-xl group-hover:from-[#0081A7]/20 group-hover:to-[#00B4D8]/20 transition-all duration-300 border border-[#0081A7]/20">
          <BarChart3 className="w-5 h-5 text-[#0081A7]" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Last 10 Days Expenses</h3>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500 font-medium">Live Data</span>
      </div>
    </div>
    
    <div className="h-48 bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 rounded-xl flex items-center justify-center border border-[#0081A7]/10 group-hover:border-[#0081A7]/20 transition-all duration-300 shadow-inner">
      <div className="w-full px-2 sm:px-4">
        <BarChart labels={chartData.labels} values={chartData.data} />
      </div>
    </div>
    
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="group/card text-center p-4 bg-gradient-to-br from-red-50/80 to-red-100/50 rounded-xl border border-red-100 hover:border-red-200 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
        <div className="flex items-center justify-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-2"></div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Today</p>
        </div>
        <p className="text-lg font-bold text-red-600">
          ₹{(chartData?.data?.[0] ?? 0).toFixed(2)}
        </p>
        <div className="w-full bg-red-100 rounded-full h-1.5 mt-2">
          <div className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
        </div>
      </div>
      
      <div className="group/card text-center p-4 bg-gradient-to-br from-red-50/80 to-red-100/50 rounded-xl border border-red-100 hover:border-red-200 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
        <div className="flex items-center justify-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-2"></div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Yesterday</p>
        </div>
        <p className="text-lg font-bold text-red-600">₹{chartData?.data[1] || 0}</p>
        <div className="w-full bg-red-100 rounded-full h-1.5 mt-2">
          <div className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-500" style={{width: '70%'}}></div>
        </div>
      </div>
      
      <div className="group/card text-center p-4 bg-gradient-to-br from-[#0081A7]/10 to-[#00B4D8]/10 rounded-xl border border-[#0081A7]/20 hover:border-[#0081A7]/30 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
        <div className="flex items-center justify-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] rounded-full mr-2"></div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Average</p>
        </div>
        <p className="text-lg font-bold text-[#0081A7]">₹{Math.round(avgLast10Days) || 0}</p>
        <div className="w-full bg-[#0081A7]/20 rounded-full h-1.5 mt-2">
          <div className="bg-gradient-to-r from-[#0081A7] to-[#00B4D8] h-1.5 rounded-full transition-all duration-500" style={{width: '60%'}}></div>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>

      {/* Monthly Income & Expense Trend Line Chart - Full Width */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-[#0081A7]" />
            <h3 className="text-xl font-semibold text-gray-800">Monthly Income & Expense Trend (This Month)</h3>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{background: '#0081A7'}}></span><span className="text-sm text-gray-700">Income</span></span>
            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{background: '#DC2626'}}></span><span className="text-sm text-gray-700">Expense</span></span>
          </div>
        </div>
        <div className="w-full h-[300px]">
          <CombinedLineChart
            labels={getSynchronizedChartData().labels}
            incomeValues={getSynchronizedChartData().incomeValues}
            expenseValues={getSynchronizedChartData().expenseValues}
          />
        </div>
      </div>

      {/* This Year - Monthly Income & Expense Bar Chart */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-[#0081A7]" />
            <h3 className="text-xl font-semibold text-gray-800">This Year - Monthly Income & Expense</h3>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{background: '#0081A7'}}></span><span className="text-sm text-gray-700">Income</span></span>
            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{background: '#DC2626'}}></span><span className="text-sm text-gray-700">Expense</span></span>
          </div>
        </div>
        <div className="w-full h-[300px]">
          <MonthlyBarChart
            incomeLabels={getThisYearMonthlyData().labels}
            incomeValues={getThisYearMonthlyData().incomeValues}
            expenseLabels={getThisYearMonthlyData().labels}
            expenseValues={getThisYearMonthlyData().expenseValues}
          />
        </div>
      </div>

{/*Income Modal */}
      {isOpenIncome && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpenIncome(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpenIncome(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              {
                isEdit ? "Update Income" : "Add New Income"
              }
            </h3>

            {/* Modal Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter income title"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                  required
                >
                  <option value="salary">Salary</option>
                  <option value="bonus">Bonus</option>
                  <option value="investment">Investment</option>
                  <option value="refund">Refund</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
                  Transaction Date
                </label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                  required
                />
              </div>

              <div>
                <label htmlFor="ammount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="ammount"
                  name="ammount"
                  value={formData.ammount}
                  onChange={handleInputChange}
                  placeholder="Enter amount in ₹"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleAddIncome}
                className="w-full bg-gradient-to-r from-[#0081A7] to-[#00B4D8] hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 text-white font-medium py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Add Income
              </button>
            </div>
          </div>
        </div>
      )}

{/*Expense Modal */}

{isOpenExpense && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpenExpense(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpenExpense(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
             Add New Expense
            </h3>

            {/* Modal Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter expense title"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/100 bg-gray-50 text-gray-800"
                  required
                />
              </div>

              {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/100 bg-gray-50 text-gray-800"
                    required
                  >
                    <option value="food">Food</option>
                    <option value="rent">Rent</option>
                    <option value="travel">Travel</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="others">Others</option>
                  </select>
                </div>

              {/* Transaction Date */}
              <div>
                <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
                  Transaction Date
                </label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/100 bg-gray-50 text-gray-800"
                  required
                />
              </div>



              <div>
                <label htmlFor="ammount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="ammount"
                  name="ammount"
                  value={formData.ammount}
                  onChange={handleInputChange}
                  placeholder="Enter amount in ₹"
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/100 bg-gray-50 text-gray-800"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleAddExpense}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Option Selection Modal */}
      {isOptionModal && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOptionModal(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOptionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

                        {/* Modal Header */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {modalType === 'income' ? 'Add Income' : 'Add Expense'}
            </h3>

            {/* Options */}
            <div className="space-y-4">
              {modalType === 'income' ? (
                // Income Options
                <>
                                     <button
                     onClick={handleManualEntry}
                     className="w-full p-6 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-xl hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                   >
                    <Plus className="w-6 h-6 flex-shrink-0" />
                    <div className="text-center">
                      <div className="font-semibold text-lg">Manual Entry</div>
                      <div className="text-sm opacity-90">Enter income details manually</div>
                    </div>
                  </button>

                  <button
                    onClick={handleIncomeReceiptUpload}
                    className="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                  >
                    <Camera className="w-6 h-6 flex-shrink-0" />
                    <div className="text-center">
                      <div className="font-semibold text-lg">Income Receipt Upload</div>
                      <div className="text-sm opacity-90">Upload receipt to auto-fill details</div>
                    </div>
                  </button>
                </>
              ) : (
                // Expense Options
                <>
                                     <button
                     onClick={handleExpenseManualEntry}
                     className="w-full p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                   >
                    <Plus className="w-6 h-6 flex-shrink-0" />
                    <div className="text-center">
                      <div className="font-semibold text-lg">Manual Entry</div>
                      <div className="text-sm opacity-90">Enter expense details manually</div>
                    </div>
                  </button>

                  <button
                    onClick={handleReceiptUpload}
                    className="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                  >
                    <Camera className="w-6 h-6 flex-shrink-0" />
                    <div className="text-center">
                      <div className="font-semibold text-lg">Receipt Upload</div>
                      <div className="text-sm opacity-90">Upload receipt to auto-fill details</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageUploadModal && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsImageUploadModal(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageUploadModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

                         {/* Modal Header */}
             <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
               Upload Receipt - AI Processing
             </h3>
             <p className="text-sm text-gray-600 text-center mb-6">
               Upload a receipt image and AI will automatically extract and save the {modalType === 'income' ? 'income' : 'expense'} details
             </p>

                         {/* Image Upload Component */}
             {modalType === 'income' ? (
               <IncomeUpload onDataExtracted={handleIncomeImageDataExtracted} type="income" />
             ) : (
               <ImageUpload onDataExtracted={handleImageDataExtracted} type="expense" />
             )}
          </div>
        </div>
      )}

      {/* Bank Statement Upload Modal */}
      <BankStatementUpload 
        isOpen={isBankStatementModal} 
        onClose={closeBankStatementModal} 
      />

    </div>
    
  );
};

export default Dashboard;