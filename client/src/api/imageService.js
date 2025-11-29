import { api } from './api';

export const imageService = {
  // Process expense receipt image
  processReceipt: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('receipt', imageFile);

      const response = await api.post('/image/process-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for AI processing
      });

      // Validate response format
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // Check if the response indicates success
      if (response.data.success === false) {
        throw {
          error: response.data.error || 'Receipt processing failed',
          details: response.data.details || 'Unknown error occurred',
          suggestion: response.data.suggestion
        };
      }

      return response.data;
    } catch (error) {
      console.error('Image service error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        throw {
          error: errorData?.error || errorData?.message || 'Server error occurred',
          details: errorData?.details || 'Unknown server error',
          suggestion: errorData?.suggestion || 'Please try again later',
          status: error.response.status
        };
      } else if (error.request) {
        // Network error
        throw {
          error: 'Network error - please check your connection',
          details: 'Unable to reach the server',
          suggestion: 'Check your internet connection and try again',
          status: 0
        };
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        throw {
          error: 'Request timeout - processing took too long',
          details: 'The receipt processing is taking longer than expected',
          suggestion: 'Please try again with a clearer image or check your connection',
          status: 0
        };
      } else {
        // Other error
        throw {
          error: error.error || error.message || 'Unknown error occurred',
          details: error.details || 'An unexpected error occurred',
          suggestion: error.suggestion || 'Please try again later',
          status: 0
        };
      }
    }
  },

  // Process income receipt image
  processIncomeReceipt: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('receipt', imageFile);

      const response = await api.post('/income-image/process-income-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for AI processing
      });

      // Validate response format
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // Check if the response indicates success
      if (response.data.success === false) {
        throw {
          error: response.data.error || 'Income receipt processing failed',
          details: response.data.details || 'Unknown error occurred',
          suggestion: response.data.suggestion
        };
      }

      return response.data;
    } catch (error) {
      console.error('Income image service error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        throw {
          error: errorData?.error || errorData?.message || 'Server error occurred',
          details: errorData?.details || 'Unknown server error',
          suggestion: errorData?.suggestion || 'Please try again later',
          status: error.response.status
        };
      } else if (error.request) {
        // Network error
        throw {
          error: 'Network error - please check your connection',
          details: 'Unable to reach the server',
          suggestion: 'Check your internet connection and try again',
          status: 0
        };
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        throw {
          error: 'Request timeout - processing took too long',
          details: 'The income receipt processing is taking longer than expected',
          suggestion: 'Please try again with a clearer image or check your connection',
          status: 0
        };
      } else {
        // Other error
        throw {
          error: error.error || error.message || 'Unknown error occurred',
          details: error.details || 'An unexpected error occurred',
          suggestion: error.suggestion || 'Please try again later',
          status: 0
        };
      }
    }
  },

  // Validate image file before upload
  validateImageFile: (file) => {
    const errors = [];
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use JPEG, PNG, or GIF.');
    }
    
    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      errors.push('File size too large. Maximum size is 20MB.');
    }
    
    // Check if file is empty
    if (file.size === 0) {
      errors.push('File appears to be empty.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get file size in human readable format
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};
