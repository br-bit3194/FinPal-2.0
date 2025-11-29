import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle, Camera, FileImage, AlertTriangle } from 'lucide-react';
import { imageService } from '../api/imageService';
import { toast } from 'react-toastify';

const ImageUpload = ({ onDataExtracted, type = 'expense' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Use enhanced validation from service
    const validation = imageService.validateImageFile(file);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploadedImage(file);
    setError(null);
    setExtractedData(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await imageService.processReceipt(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.success) {
        setExtractedData(response.data);
        // Pass both parsed data and created expense id/object to parent
        onDataExtracted({ parsed: response.data, expense: response.expense });
        toast.success('Receipt processed and expense saved successfully! 🎉');
      } else {
        setError('Failed to process receipt');
        toast.error('Failed to process receipt. Please try again.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Image upload error:', err);
      
      // Enhanced error handling with details and suggestions
      const errorMessage = err.error || err.message || 'Failed to process receipt';
      const errorDetails = err.details || '';
      const errorSuggestion = err.suggestion || '';
      
      setError(errorMessage);
      
      // Show detailed error toast
      if (errorDetails || errorSuggestion) {
        toast.error(
          <div>
            <div className="font-medium">{errorMessage}</div>
            {errorDetails && <div className="text-sm opacity-90">{errorDetails}</div>}
            {errorSuggestion && <div className="text-sm opacity-90 mt-1">{errorSuggestion}</div>}
          </div>,
          { autoClose: 6000 }
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInputRef.current.files = files;
      handleFileSelect({ target: { files } });
    }
  };

  const clearUpload = () => {
    setUploadedImage(null);
    setExtractedData(null);
    setError(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceIcon = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high':
        return <CheckCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          uploadedImage
            ? 'border-green-300 bg-green-50/50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
        } ${isUploading ? 'border-blue-400 bg-blue-50/50' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {!uploadedImage ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Upload Receipt Image
              </p>
              <p className="text-gray-500 mb-3">
                Drag and drop your receipt here or click to browse
              </p>
                             <p className="text-sm text-gray-400">
                 Supports JPEG, PNG, GIF • Max 20MB
               </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-md"
            >
              <FileImage className="w-4 h-4 inline mr-2" />
              Select Image
            </button>
            


          </div>
        ) : (
          <div className="space-y-4">
            {isUploading ? (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Processing Receipt...</p>
                  <p className="text-sm text-gray-500">AI is analyzing your receipt</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
              </div>
            ) : extractedData ? (
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-green-700">
                  Receipt processed successfully!
                </p>
                <p className="text-sm text-green-600">Expense has been saved to your account</p>
              </div>
            ) : error ? (
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-lg font-medium text-red-700">Processing Failed</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : null}
          </div>
        )}

        {uploadedImage && (
          <button
            onClick={clearUpload}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 bg-white rounded-full shadow-sm hover:shadow-md"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <FileImage className="w-4 h-4" />
            Receipt Preview
          </h4>
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Receipt preview" 
              className="w-full h-48 object-contain rounded-lg border border-gray-200"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-lg p-3 shadow-lg">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              </div>
            )}
          </div>
          {uploadedImage && (
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>File:</strong> {uploadedImage.name}</p>
              <p><strong>Size:</strong> {imageService.formatFileSize(uploadedImage.size)}</p>
              <p><strong>Type:</strong> {uploadedImage.type}</p>
            </div>
          )}
        </div>
      )}

      {/* Extracted Data Display */}
      {extractedData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Extracted Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border">
                {extractedData.title}
              </p>
            </div>
            
            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Amount (₹)</label>
              <p className="text-green-600 font-bold text-lg p-3 bg-green-50 rounded-lg border border-green-200">
                ₹{extractedData.amount}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border capitalize">
                {extractedData.category}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Merchant</label>
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border">
                {extractedData.merchant}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Transaction Date</label>
              <p className="text-gray-800 font-medium p-3 bg-gray-50 rounded-lg border">
                {extractedData.date}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Confidence Level</label>
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${getConfidenceColor(extractedData.confidence)}`}>
                {getConfidenceIcon(extractedData.confidence)}
                <span className="font-medium capitalize">{extractedData.confidence}</span>
              </div>
            </div>
          </div>

          {extractedData.confidence?.toLowerCase() === 'low' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Low Confidence Warning
                  </p>
                  <p className="text-sm text-yellow-700">
                    The AI had difficulty reading this receipt clearly. Please review the extracted information above and consider manually editing if needed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Expense Saved Successfully
                </p>
                <p className="text-sm text-green-700">
                  Your expense has been automatically added to your account. You can view it in your expense list.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {!uploadedImage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Tips for Better Results
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure good lighting and clear image quality</li>
            <li>• Capture the entire receipt, including all text</li>
            <li>• Avoid shadows and glare on the receipt</li>
            <li>• Make sure the text is readable and not blurry</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
