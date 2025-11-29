// src/features/ai/aiService.js
import { api } from "../../api/api";

const generateReport = async () => {
  try {
    const response = await api.get('/ai/report');
    return response.data; // this is AI's response
  } catch (error) {
    console.error('Generate report error:', error);
    throw error;
  }
};

const generatePlan = async (formData) => {
  try {
    const response = await api.post('/ai/saving', formData);
    return response.data; // this is AI's response
  } catch (error) {
    console.error('Generate plan error:', error);
    throw error;
  }
};

const generateChat = async (userQuery) => {
  try {
    const response = await api.post('/ai/chat', { userQuery });
    return response.data; // this is AI's response
  } catch (error) {
    console.error('Generate chat error:', error);
    throw error;
  }
};

const detectRecurringPatterns = async () => {
  try {
    const response = await api.get('/ai/patterns');
    return response.data; // this is AI's response with recurring patterns
  } catch (error) {
    console.error('Detect patterns error:', error);
    throw error;
  }
};

// New function for quick pattern updates
const updatePatternsWithTransaction = async (transaction) => {
  try {
    const response = await api.post('/ai/patterns/update', { transaction });
    return response.data;
  } catch (error) {
    console.error('Update patterns error:', error);
    throw error;
  }
};

// New function for getting cached patterns (fast, no AI)
const getCachedPatterns = async () => {
  try {
    const response = await api.get('/ai/patterns/cached');
    return response.data;
  } catch (error) {
    console.error('Get cached patterns error:', error);
    throw error;
  }
};

const aiService = {
  generateReport, 
  generatePlan, 
  generateChat, 
  detectRecurringPatterns,
  updatePatternsWithTransaction,
  getCachedPatterns
};

export default aiService;
