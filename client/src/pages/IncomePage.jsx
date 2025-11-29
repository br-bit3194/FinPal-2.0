import React, { useEffect, useState } from 'react';
import { TrendingUp, Plus, Calendar, Search, Filter, Download, Edit2, Trash2, Eye, BarChart3, PieChart, DollarSign, IndianRupee, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addIncome, deleteIncome, getAllIncomes, updateIncome } from '../features/income/incomeSlice';
import { toast } from 'react-toastify';
import dayjs from "dayjs";
import LineChart from '../components/DashboardComponents/LineChart';
import { convertToCSV } from '../utils/convertToCSV';
import IncomeUpload from '../components/IncomeUpload';
// import LineChart from '../components/DashboardComponents/LineChart';

const IncomePage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isImageUploadModal, setIsImageUploadModal] = useState(false);
  const [isOptionModal, setIsOptionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  const [formData, setFormData] = useState({
    title: '',
    ammount: '',
    category: 'salary', // Default to salary
    transactionDate: new Date().toISOString().split('T')[0] // Default to today
  });
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const dispatch = useDispatch()
  const {allIncomes , isLoading , isSuccess} = useSelector(state => state.income) 
  const [render , setRender] = useState(false)
  const [isEdit , setIsEdit] = useState(false)
  const [selectedIncome , setSelectedIncome] = useState()



  useEffect(() => {
    dispatch(getAllIncomes())
  } , [dispatch , render])

  // Mock data - replace with your actual data
  // const incomeData = [
  //   { id: 1, title: 'Salary', ammount: 50000, category: 'Job', date: '2024-07-10', description: 'Monthly salary' },
  //   { id: 2, title: 'Freelance Project', ammount: 15000, category: 'Freelance', date: '2024-07-08', description: 'Web development project' },
  //   { id: 3, title: 'Investment Returns', ammount: 8000, category: 'Investment', date: '2024-07-05', description: 'Stock dividends' },
  //   { id: 4, title: 'Side Business', ammount: 12000, category: 'Business', date: '2024-07-03', description: 'Online store profits' },
  //   { id: 5, title: 'Bonus', ammount: 20000, category: 'Job', date: '2024-07-01', description: 'Performance bonus' },
  // ];

  const categories = ['Job', 'Freelance', 'Investment', 'Business', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageDataExtracted = async (data) => {
    try {
      // The income is already created by the backend, just refresh the list
      setRender(!render);
      closeImageUploadModal();
      toast.success("Income added from receipt successfully!");
      
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

  const toggleModal = () => setIsOpenModal(!isOpenModal);
  const toggleImageUploadModal = () => setIsImageUploadModal(!isImageUploadModal);
  const toggleOptionModal = () => setIsOptionModal(!isOptionModal);
  const closeModal = () => {setIsOpenModal(false) , setIsEdit(false) , setFormData({title : '' , ammount : '' , category: 'salary' , transactionDate: new Date().toISOString().split('T')[0]}) , setIsOpenDelete(false)};
  const closeImageUploadModal = () => {setIsImageUploadModal(false)};
  const closeOptionModal = () => {setIsOptionModal(false)};

  const handleManualEntry = () => {
    closeOptionModal();
    // Reset form data with proper transaction date for income
    setFormData({
      title: '',
      ammount: '',
      category: 'salary',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    toggleModal();
  };

  const handleReceiptUpload = () => {
    closeOptionModal();
    // Reset form data with proper transaction date for income
    setFormData({
      title: '',
      ammount: '',
      category: 'salary',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    toggleImageUploadModal();
  };

  //ADD INCOME 

  const handleAddIncome = async(e) => {
      e.preventDefault()
      console.log(formData)
      
      // Basic validation
      if (!formData.title || !formData.ammount || !formData.category || !formData.transactionDate) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      if(!isEdit){
        await dispatch(addIncome(formData))
      }else{
        await dispatch(updateIncome({formData , iid : selectedIncome._id}))
        setIsEdit(false)
      }
      setRender(!render)
      closeModal()
      toast.success("Income Added")
      setFormData({
        title : '', 
        ammount : '',
        category: 'salary',
        transactionDate: new Date().toISOString().split('T')[0]
      })
      // setIsEdit(false)
    }

    //Update income

    const handleEdit = (income) => {
      setFormData({
        title : income.title , 
        ammount : income.ammount,
        category: income.category || 'salary',
        transactionDate: income.transactionDate || new Date(income.createdAt).toISOString().split('T')[0]
      })

      setIsEdit(true)
      setSelectedIncome(income)

      // console.log(formData)
      toggleModal();

    }

    //Deleet Income
    const handleDelete = (income) => {
        setIsOpenDelete(!isOpenDelete)
        setSelectedIncome(income)
        // console.log(selectedIncome)
    }

    const handleDeleteIncome = async() => {
      closeModal()
      await dispatch(deleteIncome(selectedIncome._id))
      toast.success("Income Deleted")
    }

  const totalIncome = allIncomes?.reduce((sum, income) => sum + income.ammount, 0);
  const thisMonthIncome = allIncomes?.filter(income => {
    const dateToUse = income.transactionDate ? new Date(income.transactionDate) : new Date(income.createdAt);
    return dateToUse.getMonth() === new Date().getMonth();
  }).reduce((sum, income) => sum + income.ammount, 0);

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
  

 const now = new Date();

const filteredIncomes = allIncomes
  ?.filter((income) => {
    // ✅ Search Filter
    const matchesSearch = income.title.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ Period Filter
    const transactionDate = income?.transactionDate ? new Date(income.transactionDate) : new Date(income?.createdAt);
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

  //For Line Chart

      const getCurrentMonthIncomeData = (allIncomes) => {
      const currentMonth = dayjs().month();
      const currentYear = dayjs().year();

      // Filter for this month's incomes
      const filtered = allIncomes.filter((income) => {
        const date = income.transactionDate ? dayjs(income.transactionDate) : dayjs(income.createdAt);
        return date.month() === currentMonth && date.year() === currentYear;
      });

      // Create map of days with totals
      const dailyIncome = {};

      for (let i = 1; i <= dayjs().date(); i++) {
        dailyIncome[i] = 0; // Initialize days with 0
      }

      filtered.forEach((income) => {
        const day = income.transactionDate ? dayjs(income.transactionDate).date() : dayjs(income.createdAt).date();
        dailyIncome[day] += income.ammount;
      });

      const labels = Object.keys(dailyIncome).map((day) => `${day}`);
      const values = Object.values(dailyIncome);

      return { labels, values };
    };

    const { labels: incomeLabels, values: incomeValues } = getCurrentMonthIncomeData(allIncomes);

    // console.log(labels)

    const downloadFilteredIncomes = filteredIncomes.map((item) => ({
  title: item.title,
  category: item.category || 'others',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-[#0081A7]/5 p-6 ml-0 sm:ml-0 pt-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              💰 Income <span className="text-[#0081A7]">Command Center</span>
            </h1>
            <p className="text-gray-600">Track and manage your income streams with precision. Build wealth through smart income management.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button 
              onClick={toggleOptionModal}
              className="px-6 py-3 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-xl hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Income
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
                <p className="text-3xl font-bold text-[#0081A7]">₹{totalIncome?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[#00B4D8] font-medium">+8.2%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* This Month Income */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0081A7] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-[#00B4D8]/10 to-[#0081A7]/10 rounded-xl group-hover:from-[#00B4D8]/20 group-hover:to-[#0081A7]/20 transition-all duration-300 border border-[#00B4D8]/20">
                <Calendar className="w-6 h-6 text-[#00B4D8]" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
                <p className="text-3xl font-bold text-[#00B4D8]">₹{thisMonthIncome.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[#0081A7] font-medium">+12.5%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Average Income */}
        <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300 border border-green-200/50">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Average Income</p>
                <p className="text-3xl font-bold text-green-600">₹{Math.round(totalIncome / allIncomes.length).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">+5.3%</span>
              <span className="text-gray-500 ml-2">per transaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search income..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
            />
          </div>

          {/* Period Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800 appearance-none"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              
            </select>
          </div>

          {/* Export Button */}
          <button onClick={() => downloadCSV(downloadFilteredIncomes, "incomes.csv")} className="px-4 py-2 bg-gradient-to-r from-[#00B4D8] to-[#0081A7] text-white rounded-lg hover:from-[#00B4D8]/90 hover:to-[#0081A7]/90 transition-all duration-300 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Income List */}
      <div className="bg-white/95 mb-10 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-800">Income Transactions</h3>
        </div>
        
                <div className="overflow-x-auto" style={{ maxHeight: '340px', overflowY: 'auto' }}>
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#0081A7]/5 to-[#00B4D8]/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {filteredIncomes?.slice(0, 4).map((income) => (
                <tr key={income.id || income._id} className="hover:bg-gradient-to-r hover:from-[#0081A7]/5 hover:to-[#00B4D8]/5 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-lg flex items-center justify-center mr-3">
                        <TrendingUp className="w-5 h-5 text-[#0081A7]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{income?.title}</div>
                        <div className="text-xs text-gray-500 capitalize">{income?.category || 'others'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {income?.category || 'others'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0081A7]">
                    ₹{income?.ammount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {income?.transactionDate ? 
                      new Date(income.transactionDate).toLocaleDateString('en-GB') : 
                      new Date(income.createdAt).toLocaleDateString('en-GB')
                    }
                    <div className="text-xs text-gray-400">
                      {income?.transactionDate ? dateToHour(income.transactionDate) : dateToHour(income.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleEdit(income)} className="text-[#00B4D8] hover:text-[#0081A7] transition-colors duration-200">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleDelete(income)} className="text-red-600 hover:text-red-700 transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Show remaining incomes in scrollable area */}
              {filteredIncomes?.length > 4 && filteredIncomes.slice(4).map((income) => (
                <tr key={income.id || income._id} className="hover:bg-gradient-to-r hover:from-[#0081A7]/5 hover:to-[#00B4D8]/5 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-lg flex items-center justify-center mr-3">
                        <TrendingUp className="w-5 h-5 text-[#0081A7]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{income?.title}</div>
                        <div className="text-xs text-gray-500 capitalize">{income?.category || 'others'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {income?.category || 'others'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0081A7]">
                    ₹{income?.ammount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {income?.transactionDate ? 
                      new Date(income.transactionDate).toLocaleDateString('en-GB') : 
                      new Date(income.createdAt).toLocaleDateString('en-GB')
                    }
                    <div className="text-xs text-gray-400">
                      {income?.transactionDate ? dateToHour(income.transactionDate) : dateToHour(income.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleEdit(income)} className="text-[#00B4D8] hover:text-[#0081A7] transition-colors duration-200">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleDelete(income)} className="text-red-600 hover:text-red-700 transition-colors duration-200">
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

      {/* <LineChart allIncomes={allIncomes} /> */}
      {/* Income Overview - Line Chart */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50 mt-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Income Trend (This Month)</h3>
            <p className="text-sm text-gray-500">Visual representation of your income day-by-day for this month.</p>
          </div>

          <div className="w-full overflow-x-auto">
            <LineChart labels={incomeLabels} values={incomeValues} />
          </div>
        </div>




      {/* Add Income Modal */}
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
                {isEdit ? "Update Income" : "Add Income"}
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
                Delete Income
              </h3>
              
              {/* Modal Message */}
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this income? This action cannot be undone.
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
                  onClick={handleDeleteIncome}
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
              Add Income
            </h3>

            {/* Options */}
            <div className="space-y-4">
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
                onClick={handleReceiptUpload}
                className="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
              >
                <Camera className="w-6 h-6 flex-shrink-0" />
                <div className="text-center">
                  <div className="font-semibold text-lg">Income Receipt Upload</div>
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
              Upload a receipt image and AI will automatically extract and save the income details
            </p>

            {/* Image Upload Component */}
                            <IncomeUpload onDataExtracted={handleImageDataExtracted} type="income" />


          </div>
        </div>
      )}
    </div>
  );
};

export default IncomePage;