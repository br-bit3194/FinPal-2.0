import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const authSlice = createSlice(
   {
        name : "auth" ,
        initialState : {
            user : JSON.parse(localStorage.getItem('user')) || null ,
            isLoading : false ,
            isError : false ,
            isSuccess : false ,
            message : ""
        },
        reducers : {
            reset: (state) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = false;
                state.message = "";
            },
            clearError: (state) => {
                state.isError = false;
                state.message = "";
            }
        },
        extraReducers : (builder) => {
            builder
            .addCase(signInUser.pending , (state ,action) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(signInUser.fulfilled , (state ,action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isSuccess = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(signInUser.rejected , (state ,action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload || 'Authentication failed';
            })
            //LOGOUT
            .addCase(logoutUser.fulfilled , (state , action) => {
                state.user = null;
                state.isSuccess = false;
                state.isError = false;
                state.message = "";
            })
        }
   }
)

export default authSlice.reducer
export const { reset, clearError } = authSlice.actions;

export const signInUser = createAsyncThunk(
    "AUTH/USER" , 
    async (formData , thunkAPI) => {
        try {
            const response = await authService.register(formData);
            // Store token in localStorage for API calls
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Authentication failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const logoutUser = createAsyncThunk(
    "AUTH/LOGOUT" , 
    async (_, thunkAPI) => {
        try {
            await authService.logout();
            // Clear token from localStorage
            localStorage.removeItem('token');
            return { success: true };
        } catch (error) {
            // Even if logout fails, clear local storage
            localStorage.removeItem('token');
            return { success: true };
        }
    }
)