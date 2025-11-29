import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aiService from "./aiService";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    aiReport: null , // store AI response here
    aiPlan : null,
    isAdviceLoading : null , 
    aiChat : null , 
    isChatLoading : false
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.aiReport = null;
      state.aiPlan = null ,
      state.aiChat = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateAIReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.aiReport = action.payload; // save AI response
      })
      .addCase(generateAIReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //Generate Saving Plan
      .addCase(generateSavingAdvisor.pending, (state) => {
        state.isAdviceLoading = true;
      })
      .addCase(generateSavingAdvisor.fulfilled, (state, action) => {
        state.isAdviceLoading = false;
        state.isSuccess = true;
        state.aiPlan = action.payload; // save AI response
      })
      .addCase(generateSavingAdvisor.rejected, (state, action) => {
        state.isAdviceLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //Generate Chat
      .addCase(generatePersonalChat.pending, (state) => {
        state.isChatLoading = true;
      })
      .addCase(generatePersonalChat.fulfilled, (state, action) => {
        state.isChatLoading = false;
        state.isSuccess = true;
        state.aiChat = action.payload; // save AI response
      })
      .addCase(generatePersonalChat.rejected, (state, action) => {
        state.isChatLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export default aiSlice.reducer

export const generateAIReport = createAsyncThunk(
  "ai/generate",
  async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
      return await aiService.generateReport(token);
    } 
    catch(error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
  }
);

export const generateSavingAdvisor = createAsyncThunk(
  "ai/saving",
  async (formData, thunkAPI) => {
    // console.log(formData)
    let token = thunkAPI.getState().auth.user.token
    try {
      return await aiService.generatePlan(formData , token);
    } 
    catch(error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
  }
);

export const generatePersonalChat = createAsyncThunk(
  "ai/chat",
  async (userQuery, thunkAPI) => {
    // console.log(userQuery)
    let token = thunkAPI.getState().auth.user.token
    try {
      return await aiService.generateChat(userQuery , token);
    } 
    catch(error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
  }
);