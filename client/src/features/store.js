import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice"
import income from "./income/incomeSlice"
import expense from "./expense/expenseSlice"
import ai from "./ai/aiSlice"
import transaction from "./transaction/transactionSlice"
import challenges from "./challenges/challengeSlice"

const store = configureStore(
    {
        reducer : {auth , income , expense , ai , transaction, challenges}
    }
)

export default store