# Image Upload Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to process receipt" Error

This error can occur due to several reasons:

#### **A. Missing Environment Variables**
Make sure your server has the required environment variables in `.env`:

```env
# Required for image processing
GEMINI_API_KEY=your_gemini_api_key_here

# Other required variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

**To get a Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

#### **B. Server Not Running**
Make sure your server is running:
```bash
cd server
npm start
```

#### **C. Authentication Issues**
The image processing requires authentication. Make sure you're logged in and have a valid token.

#### **D. Network Issues**
Check if your client can reach the server:
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try uploading an image
4. Check for failed requests

### 2. Debug Steps

#### **Step 1: Test API Connection**
1. Open the image upload modal
2. Click the "Test API" button
3. Check the console for the response

#### **Step 2: Check Console Errors**
1. Open browser dev tools (F12)
2. Go to Console tab
3. Try uploading an image
4. Look for error messages

#### **Step 3: Check Network Tab**
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try uploading an image
4. Look for the `/api/image/process-receipt` request
5. Check the response status and body

### 3. Common Error Messages

| Error Message | Possible Cause | Solution |
|---------------|----------------|----------|
| "Network error" | Server not running | Start the server |
| "Unauthorized" | Not logged in | Log in to the app |
| "Missing API key" | GEMINI_API_KEY not set | Add API key to .env |
| "File too large" | Image > 5MB | Use smaller image |
| "Invalid file type" | Not an image | Use JPEG, PNG, or GIF |

### 4. Testing the Feature

1. **Start both client and server**
2. **Log in to the application**
3. **Go to Expense page**
4. **Click "Add Expense"**
5. **Select "Receipt Upload"**
6. **Upload a clear receipt image**
7. **Check if data is extracted**

### 5. Getting Help

If you're still having issues:
1. Check the browser console for detailed error messages
2. Check the server console for backend errors
3. Verify all environment variables are set
4. Make sure you have a valid Gemini API key
