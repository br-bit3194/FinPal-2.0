import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import financeService from "./transactionService";

const transactionSlice = createSlice(
    {
        name : "transaction" , 
        initialState : {
            transaction : {} ,
            transactions : [] ,
            isSuccess : false , 
            isError : false , 
            isLoading : false
        } , 
        reducers : {} ,
        extraReducers : builder => {
            builder
            .addCase(getallTransactions.pending , (state , action)    => {
                state.isLoading = true
                state.isSuccess = false 
                state.isError = false
            })
            .addCase(getallTransactions.fulfilled , (state , action)    => {
                state.isLoading = false
                state.isSuccess = true
                state.transactions = action.payload 
                state.isError = false
            })
            .addCase(getallTransactions.rejected , (state , action)    => {
                state.isLoading = false
                state.isSuccess = false 
                state.isError = true
                state.message = action.payload
            })
        }
    }
)

export default transactionSlice.reducer

export const getallTransactions = createAsyncThunk(
    "GET/TRANSACTIONS" , 
    async (_ , thunkAPI) => {
        let token = thunkAPI.getState().auth.user.token
        // console.log(token)
        try {
            return await financeService.getallTransactions(token)
        } catch (error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
    }
)