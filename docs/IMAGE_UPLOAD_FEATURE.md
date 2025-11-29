# Image Receipt Upload Feature

## Overview
The FinPal application now includes an AI-powered image receipt upload feature that allows users to automatically extract expense and income information from receipt images. This feature uses Google's Gemini AI to analyze receipt images and extract relevant financial data.

## Features

### 1. Image Upload
- **Supported Formats**: JPEG, JPG, PNG, GIF
- **File Size Limit**: 5MB maximum
- **Drag & Drop**: Users can drag and drop images directly onto the upload area
- **Click to Select**: Traditional file picker interface

### 2. AI-Powered Data Extraction
The system extracts the following information from receipt images:
- **Title**: Brief description of the purchase
- **Amount**: Total amount (numeric value)
- **Category**: Automatically classified into predefined categories
- **Date**: Date from the receipt (if available)
- **Merchant**: Store/merchant name
- **Confidence Level**: High/Medium/Low based on image clarity

### 3. Categories
For expenses, the system classifies receipts into these categories:
- Food
- Rent
- Travel
- Entertainment
- Shopping
- Others

### 4. User Interface
- **Visual Feedback**: Loading states, success/error indicators
- **Confidence Indicators**: Color-coded confidence levels
- **Automatic Processing**: AI extracts data and automatically saves to database
- **Streamlined Workflow**: No manual form filling required

## Technical Implementation

### Backend Components

#### 1. Image Controller (`server/Controllers/imageController.js`)
- Handles file upload using Multer
- Processes images with Google Gemini AI
- Extracts and validates financial data
- Returns structured JSON response

#### 2. Image Routes (`server/Routes/imageRoutes.js`)
- Protected route requiring authentication
- Handles POST requests for image processing

#### 3. Dependencies
- `multer`: File upload handling
- `@google/generative-ai`: AI image analysis
- `fs`: File system operations

### Frontend Components

#### 1. Image Upload Component (`client/src/components/ImageUpload.jsx`)
- Reusable component for image upload
- Drag and drop functionality
- Progress indicators and error handling
- Data extraction display

#### 2. Image Service (`client/src/api/imageService.js`)
- API service for image processing
- Handles FormData uploads
- Error handling and response processing

#### 3. Integration
- Added to both Expense and Income pages
- Modal-based interface
- Seamless integration with existing forms

## API Endpoints

### POST `/api/image/process-receipt`
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `receipt`: Image file
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "title": "Grocery Shopping",
      "amount": "1250.50",
      "category": "food",
      "date": "2024-01-15",
      "merchant": "Walmart",
      "confidence": "High"
    }
  }
  ```

## Usage Instructions

### For Users

1. **Navigate** to the Expense or Income page
2. **Click** the "Upload Receipt" button (blue camera icon)
3. **Upload** an image by:
   - Dragging and dropping the image onto the upload area
   - Clicking "Select Image" to choose from file browser
4. **Wait** for AI processing (usually 2-5 seconds)
5. **Review** the extracted information (displayed for confirmation)
6. **Data is automatically saved** to the database
7. **Modal closes automatically** after successful processing

### For Developers

#### Adding to New Pages
```jsx
import ImageUpload from '../components/ImageUpload';

// In your component
const handleImageDataExtracted = (data) => {
  setFormData({
    title: data.title || '',
    amount: data.amount || '',
    category: data.category || ''
  });
};

// In your JSX
<ImageUpload onDataExtracted={handleImageDataExtracted} type="expense" />
```

#### Customizing Categories
Edit the AI prompt in `server/Controllers/imageController.js` to modify category options.

## Error Handling

### Common Issues
1. **File Size Too Large**: Maximum 5MB
2. **Invalid File Type**: Only image files supported
3. **Poor Image Quality**: May result in low confidence extraction
4. **Network Issues**: Upload failures are handled gracefully

### Error Messages
- Clear, user-friendly error messages
- Toast notifications for feedback
- Visual indicators for different error types

## Security Considerations

1. **File Validation**: Server-side file type and size validation
2. **Authentication**: All image processing requires user authentication
3. **Temporary Storage**: Uploaded files are deleted after processing
4. **Rate Limiting**: Consider implementing rate limiting for production

## Performance Optimization

1. **Image Compression**: Consider client-side compression for large images
2. **Caching**: Implement caching for frequently processed images
3. **Background Processing**: For production, consider queue-based processing

## Future Enhancements

1. **Batch Upload**: Multiple receipt processing
2. **OCR Improvements**: Enhanced text recognition
3. **Receipt Storage**: Option to store receipt images
4. **Export Features**: Export processed data
5. **Mobile Optimization**: Camera integration for mobile devices

## Troubleshooting

### Server Issues
- Check if `GEMINI_API_KEY` is set in environment variables
- Verify multer installation: `npm install multer`
- Ensure uploads directory exists and is writable

### Client Issues
- Check browser console for JavaScript errors
- Verify API endpoint accessibility
- Test with different image formats and sizes

## Dependencies

### Backend
```json
{
  "multer": "^1.4.5-lts.1",
  "@google/generative-ai": "^0.24.1"
}
```

### Frontend
- React hooks for state management
- Lucide React for icons
- React-toastify for notifications
