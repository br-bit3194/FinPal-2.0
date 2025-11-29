import  {createAsyncThunk, createSlice}   from "@reduxjs/toolkit";
import incomeService from "./incomeService";

const incomeSLice = createSlice(
    {
        name : "income" , 
        initialState : {
            income : {} ,
            allIncomes : [] ,
            isError : false ,
            isSuccess : false ,
            isLoading : false
        } , 
        reducers :{} ,
        extraReducers : builder => {
            builder
            .addCase(getAllIncomes.pending , (state , action)    => {
                state.isLoading = true
                state.isSuccess = false 
                state.isError = false
            })
            .addCase(getAllIncomes.fulfilled , (state , action)    => {
                state.isLoading = false
                state.isSuccess = true
                state.allIncomes = action.payload 
                state.isError = false
            })
            .addCase(getAllIncomes.rejected , (state , action)    => {
                state.isLoading = false
                state.isSuccess = false 
                state.isError = true
                state.message = action.payload
            })
            //ADD INCOME CASE
            .addCase(addIncome.pending , (state , action)    => {
                state.isLoading = true
                state.isSuccess = false 
                state.isError = false
            })
            .addCase(addIncome.fulfilled , (state , action)    => {
                state.isLoading = false
                state.isSuccess = true
                state.allIncomes = [action.payload , ...state.allIncomes ]
                state.isError = false
            })
            .addCase(addIncome.rejected , (state , action)    => {
                state.isLoading = false
                state.isSuccess = false 
                state.isError = true
                state.message = action.payload
            })
            //DELETE INCOME CASE
            .addCase(deleteIncome.pending , (state , action)    => {
                state.isLoading = true
                state.isSuccess = false 
                state.isError = false
            })
            .addCase(deleteIncome.fulfilled , (state , action)    => {
                state.isLoading = false
                state.isSuccess = true
                state.allIncomes = state.allIncomes.filter(income => income._id != action.payload._id)
                state.isError = false
            })
            .addCase(deleteIncome.rejected , (state , action)    => {
                state.isLoading = false
                state.isSuccess = false 
                state.isError = true
                state.message = action.payload
            })
        }
    }
)

export default incomeSLice.reducer

export const getAllIncomes = createAsyncThunk(
    "GET/ALL_INCOME" , 
    async (_ , thunkAPI) => {
        let token = thunkAPI.getState().auth.user.token
        try {
            return await incomeService.getAllIncomes(token)
        } catch (error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
    }
)

//ADD INCOME

export const addIncome = createAsyncThunk(
    "ADD/INCOME" , 
    async (formData , thunkAPI) => {
        let token = thunkAPI.getState().auth.user.token
        try {
            return await incomeService.addIncome(formData , token)
        } catch (error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
    }
)

//UPDATE INCOME

export const updateIncome = createAsyncThunk(
    "UPDATE/INCOME" , 
    async ({formData , iid} , thunkAPI) => {
        let token = thunkAPI.getState().auth.user.token
        // console.log(formData , iid)
        try {
            return await incomeService.updateIncome(formData , iid ,  token)
        } catch (error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
    }
)


//DELETE INCOME

export const deleteIncome = createAsyncThunk(
    "DELETE/INCOME" , 
    async (iid , thunkAPI) => {
        let token = thunkAPI.getState().auth.user.token
        // console.log(formData , iid)
        try {
            return await incomeService.deleteIncome(iid ,  token)
        } catch (error) {
            const message = error.response.data.message
            thunkAPI.rejectWithValue(message)
        }
    }
)

