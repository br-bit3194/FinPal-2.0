import React, { useState } from 'react';
import { TrendingDown, Plus, Calendar, Search, Filter, Download, Edit2, Trash2, Eye, BarChart3, PieChart, CreditCard, AlertCircle, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { addExpense, deleteExpense, getAllExpenses, updateExpense } from '../features/expense/expenseSlice';
import { toast } from 'react-toastify';
import dayjs from "dayjs";

import LineChart from '../components/DashboardComponents/LineChart';
import LineChartExpense from '../components/DashboardComponents/LineChartExpense';
import { convertToCSV } from '../utils/convertToCSV';
import PieChartCategory from '../components/PieChartCategory';
import ImageUpload from '../components/ImageUpload';


const ExpensePage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isImageUploadModal, setIsImageUploadModal] = useState(false);
  const [isOptionModal, setIsOptionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedExpense , setSelectedExpense] = useState()
  
  const [formData, setFormData] = useState({
    title: '',
    ammount: '',
    category : '',
    transactionDate: new Date().toISOString().split('T')[0] // Default to today
  
  });

    const [isOpenDelete, setIsOpenDelete] = useState(false);
  

  const {allExpenses} = useSelector(state => state.expense)

    const [render , setRender] = useState(false)
    const [isEdit , setIsEdit] = useState(false)

  const dispatch = useDispatch()

  //Fetching all expense
  useEffect(() => {
    dispatch(getAllExpenses())
  } , [dispatch , render])

  // console.log(allExpenses)

  const handleAddExpense = async(e) => {
        e.preventDefault()
        console.log(formData)
        
        // Basic validation
        if (!formData.title || !formData.ammount || !formData.category || !formData.transactionDate) {
          toast.error("Please fill in all required fields");
          return;
        }
        
        if(!isEdit){
          await dispatch(addExpense(formData))
        }
        else{
          await dispatch(updateExpense({formData , eid : selectedExpense._id}))
          setIsEdit(false)
        }
        setRender(!render)
        closeModal()
        toast.success("Expense Added")
        setFormData({
          title : '', 
          ammount : '' ,
          category : '',
          transactionDate: new Date().toISOString().split('T')[0]
        })
        // setIsEdit(false)
      }

  // Mock data - replace with your actual data



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageDataExtracted = async (data) => {
    try {
      // The expense is already created by the backend, just refresh the list
      setRender(!render);
      closeImageUploadModal();
      toast.success("Expense added from receipt successfully!");
      
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

  const toggleModal = () => setIsOpenModal(!isOpenModal);
  const toggleImageUploadModal = () => setIsImageUploadModal(!isImageUploadModal);
  const toggleOptionModal = () => setIsOptionModal(!isOptionModal);
  const closeModal = () => {setIsOpenModal(false) , setFormData({title : "" , ammount : "" , category : "" , transactionDate: new Date().toISOString().split('T')[0]}) , setIsOpenDelete(false)};
  const closeImageUploadModal = () => {setIsImageUploadModal(false)};
  const closeOptionModal = () => {setIsOptionModal(false)};

  const handleManualEntry = () => {
    closeOptionModal();
    // Reset form data with proper transaction date for expense
    setFormData({
      title: '',
      ammount: '',
      category: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    toggleModal();
  };

  const handleReceiptUpload = () => {
    closeOptionModal();
    // Reset form data with proper transaction date for expense
    setFormData({
      title: '',
      ammount: '',
      category: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    toggleImageUploadModal();
  };

const handleEdit = (expense) => {
      setFormData({
        title : expense.title , 
        ammount : expense.ammount ,
        category : expense.category,
        transactionDate: expense.transactionDate || new Date(expense.createdAt).toISOString().split('T')[0]
      })

      setIsEdit(true)
      setSelectedExpense(expense)

      // console.log(formData)
      toggleModal();

}

  const totalExpense = allExpenses.reduce((sum, expense) => sum + expense.ammount, 0);
  const thisMonthExpense = allExpenses.filter(expense => {
    const dateToUse = expense.transactionDate ? new Date(expense.transactionDate) : new Date(expense.createdAt);
    return dateToUse.getMonth() === new Date().getMonth();
  }).reduce((sum, expense) => sum + expense.ammount, 0);

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
  

  // const filteredExpenses = allExpenses?.filter(expense => 
  //   expense.title.toLowerCase().includes(searchTerm.toLowerCase()) 
  // );

   const now = new Date();


  const filteredExpenses = allExpenses
  ?.filter((expense) => {
    // ✅ Search Filter
    const matchesSearch = expense?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ Period Filter
    const transactionDate = expense?.transactionDate ? new Date(expense.transactionDate) : new Date(expense?.createdAt);
    let matchesPeriod = true;

    if (filterPeriod === "today") {
      matchesPeriod =
        transactionDate.toDateString() === now.toDateString();
    } else if (filterPeriod === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      matchesPeriod = transactionDate >= startOfWeek;
    } else if (filterPeriod === "month") {
      matchesPeriod =
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear();
    } else if (filterPeriod === "year") {
      matchesPeriod = transactionDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesPeriod;
  })
  ?.sort((a, b) => {
    // ✅ Sorting
    if (sortBy === "amount") {
      return b.ammount - a.ammount;
    } else if (sortBy === "date") {
      // Use transactionDate for sorting, fallback to createdAt
      const dateA = a?.transactionDate ? new Date(a.transactionDate) : new Date(a.createdAt);
      const dateB = b?.transactionDate ? new Date(b.transactionDate) : new Date(b.createdAt);
      return dateB - dateA; // Descending order (most recent first)
    } else {
      return 0;
    }
  });

  //DELETE 
  const handleDelete = (expense) => {

    setIsOpenDelete(true)
    setSelectedExpense(expense)

  }

  const handleDeleteExpense = async() => {
        closeModal()
        await dispatch(deleteExpense(selectedExpense._id))
        toast.success("Expense Deleted")
      }

      //For Line Chart
      
            const getCurrentMonthExpenseData = (allExpenses) => {
            const currentMonth = dayjs().month();
            const currentYear = dayjs().year();
      
            // Filter for this month's expenses
            const filtered = allExpenses.filter((expense) => {
              const date = expense.transactionDate ? dayjs(expense.transactionDate) : dayjs(expense.createdAt);
              return date.month() === currentMonth && date.year() === currentYear;
            });
      
            // Create map of days with totals
            const dailyExpense = {};
      
            for (let i = 1; i <= dayjs().date(); i++) {
              dailyExpense[i] = 0; // Initialize days with 0
            }
      
            filtered.forEach((expense) => {
              const day = expense.transactionDate ? dayjs(expense.transactionDate).date() : dayjs(expense.createdAt).date();
              dailyExpense[day] += expense.ammount;
            });
      
            const labels = Object.keys(dailyExpense).map((day) => `${day}`);
            const values = Object.values(dailyExpense);
      
            return { labels, values };
          };
      
          const { labels: incomeLabels, values: incomeValues } = getCurrentMonthExpenseData(allExpenses);

  //Download Expenses

      const downloadFilteredExpenses = filteredExpenses.map((item) => ({
    title: item.title,
    amount: item.ammount,
    transactionDate: item.transactionDate ? 
      new Date(item.transactionDate).toLocaleDateString('en-GB') : 
      new Date(item.createdAt).toLocaleDateString('en-GB'),
  }));
  
  
  //Downoad a CSV
  const downloadCSV = (data, filename = "data.csv") => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
 


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-red-50/20 p-6 ml-0 sm:ml-0 pt-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎯 Spending <span className="text-red-600">War Room</span>
            </h1>
            <p className="text-gray-600">Take control of your spending with precision. Track, analyze, and optimize expenses to build wealth.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button 
              onClick={toggleOptionModal}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Expenses */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300 border border-red-200/50">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600">₹{totalExpense?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-red-500 font-medium">+5.2%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* This Month Expenses */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300 border border-orange-200/50">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
                <p className="text-3xl font-bold text-orange-600">₹{thisMonthExpense?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-orange-500 font-medium">+8.1%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Average Expense */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300 border border-yellow-200/50">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Average Expense</p>
                <p className="text-3xl font-bold text-yellow-600">₹{Math.round(totalExpense / allExpenses?.length).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-yellow-500 font-medium">+2.3%</span>
              <span className="text-gray-500 ml-2">per transaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alert */}
      

      {/* Filters and Search */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-gray-50 text-gray-800"
            />
          </div>

          {/* Period Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-gray-50 text-gray-800 appearance-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-gray-50 text-gray-800"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>

          {/* Export Button */}
          <button onClick={() => downloadCSV(downloadFilteredExpenses, "expense.csv")} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>


      {/* Category-wise Expense Pie Chart and Expense List */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Pie Chart */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6 flex-shrink-0" style={{ minWidth: 350 }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Category-wise Expenses</h3>
          <PieChartCategory expenses={filteredExpenses} />
        </div>
        {/* Expense List */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden flex-1">
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-800">Expense Transactions</h3>
          </div>
          <div className="overflow-x-auto" style={{ maxHeight: '340px', overflowY: 'auto' }}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredExpenses?.slice(0, 4).map((expense) => (
                  <tr key={expense.id || expense._id} className="hover:bg-red-50/50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 text-lg">
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{expense?.title}</div>
                          <div className="text-xs  text-gray-500">{expense?.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      -₹{expense?.ammount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense?.transactionDate ? 
                      new Date(expense.transactionDate).toLocaleDateString('en-GB') : 
                      new Date(expense?.createdAt).toLocaleDateString('en-GB')
                    }
                      <div className="text-xs text-gray-400">
                      {expense?.transactionDate ? dateToHour(expense.transactionDate) : dateToHour(expense?.createdAt)} hours ago
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => handleEdit(expense)} className="text-yellow-600 hover:text-yellow-700 transition-colors duration-200">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(expense)} className="text-red-600 hover:text-red-700 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Show remaining expenses in scrollable area */}
                {filteredExpenses?.length > 4 && filteredExpenses.slice(4).map((expense) => (
                  <tr key={expense.id || expense._id} className="hover:bg-red-50/50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 text-lg">
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{expense?.title}</div>
                          <div className="text-xs  text-gray-500">{expense?.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      -₹{expense?.ammount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense?.transactionDate ? 
                      new Date(expense.transactionDate).toLocaleDateString('en-GB') : 
                      new Date(expense?.createdAt).toLocaleDateString('en-GB')
                    }
                      <div className="text-xs text-gray-400">
                      {expense?.transactionDate ? dateToHour(expense.transactionDate) : dateToHour(expense?.createdAt)}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => handleEdit(expense)} className="text-yellow-600 hover:text-yellow-700 transition-colors duration-200">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(expense)} className="text-red-600 hover:text-red-700 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Income Overview - Line Chart */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50 mt-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Expense Trend (This Month)</h3>
            <p className="text-sm text-gray-500">Visual representation of your expense day-by-day for this month.</p>
          </div>

          <div className="w-full overflow-x-auto">
            <LineChartExpense labels={incomeLabels} values={incomeValues} />
          </div>
        </div>

      {/* Add Expense Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
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
                isEdit ? "Update Income" : "Add New Expense"
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
                    <option value="" disabled>Select category</option>
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
                {isEdit ? "Update Expense" : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Delete income modal */}
      {isOpenDelete && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
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
            
            {/* Modal Content */}
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              
              {/* Modal Header */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Delete Expense
              </h3>
              
              {/* Modal Message */}
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this Expense? This action cannot be undone.
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteExpense}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition-all shadow-md hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Option Selection Modal */}
      {isOptionModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeOptionModal}
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
              Add Expense
            </h3>

            {/* Options */}
            <div className="space-y-4">
              <button
                onClick={handleManualEntry}
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
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageUploadModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeImageUploadModal}
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
              Upload a receipt image and AI will automatically extract and save the expense details
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">How it works:</span>
              </div>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Upload a clear image of your receipt</li>
                <li>• AI analyzes the image and extracts key information</li>
                <li>• Expense is automatically created and saved</li>
                <li>• Review the extracted data for accuracy</li>
              </ul>
            </div>

            {/* Image Upload Component */}
            <ImageUpload onDataExtracted={handleImageDataExtracted} type="expense" />


          </div>
        </div>
      )}

    </div>
  );
};

export default ExpensePage;