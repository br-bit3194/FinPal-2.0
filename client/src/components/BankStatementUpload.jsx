import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addIncome, getAllIncomes } from '../features/income/incomeSlice';
import { addExpense, getAllExpenses } from '../features/expense/expenseSlice';

const BankStatementUpload = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setProcessingResults(null);
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const processBankStatement = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file first');
      return;
    }

    setIsProcessing(true);
    setProcessingResults(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bank-statement/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProcessingResults(data);
        toast.success(`Successfully processed ${data.processedCount} transactions!`);

        // Refresh the dashboard data
        dispatch(getAllIncomes());
        dispatch(getAllExpenses());
      } else {
        throw new Error(data.message || 'Failed to process bank statement');
      }
    } catch (error) {
      console.error('Error processing bank statement:', error);
      toast.error(error.message || 'Error processing bank statement');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setProcessingResults(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Upload Bank Statement</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!processingResults ? (
            <>
              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : selectedFile
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-3">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          Drop your bank statement PDF here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse files
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label
                        htmlFor="pdf-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Choose PDF File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload your bank statement PDF (HDFC, SBI, ICICI, etc.)</li>
                  <li>• Our AI will extract all transactions automatically</li>
                  <li>• Credits will be added as income, debits as expenses</li>
                  <li>• Each transaction will be categorized and dated</li>
                  <li>• All data will be imported to your dashboard</li>
                </ul>
              </div>

              {/* Process Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processBankStatement}
                  disabled={!selectedFile || isProcessing}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${!selectedFile || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Process Statement'
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Processing Complete!
                </h3>
                <p className="text-gray-600">
                  Successfully processed your bank statement
                </p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{processingResults.totalCredits || 0}
                  </p>
                  <p className="text-sm text-green-700">Total Credits</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    ₹{processingResults.totalDebits || 0}
                  </p>
                  <p className="text-sm text-red-700">Total Debits</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {processingResults.processedCount || 0}
                  </p>
                  <p className="text-sm text-blue-700">Transactions</p>
                </div>
              </div>

              {/* Transaction Details */}
              {processingResults.transactions && processingResults.transactions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Processed Transactions:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {processingResults.transactions.map((txn, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${txn.type === 'income'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              {txn.data.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {txn.data.category} • {txn.data.transactionDate}
                            </p>
                          </div>
                          <span
                            className={`font-semibold ${txn.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                              }`}
                          >
                            {txn.type === 'income' ? '+' : '-'}₹{txn.data.ammount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Process Another
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankStatementUpload;
