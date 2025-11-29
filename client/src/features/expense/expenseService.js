import { api } from "../../api/api"

const getAllExpenses = async() => {
    try {
        const response = await api.get('/expense')
        return response.data
    } catch (error) {
        console.error('Get expenses error:', error)
        throw error
    }
}

//Add EXPENSE
const addExpense = async(formData) => {
    try {
        const response = await api.post('/expense', formData)
        return response.data
    } catch (error) {
        console.error('Add expense error:', error)
        throw error
    }
}

//Update Expense
const updateExpense = async(formData, eid) => {
    try {
        const response = await api.put(`/expense/${eid}`, formData)
        return response.data
    } catch (error) {
        console.error('Update expense error:', error)
        throw error
    }
}

//Delete expense
const deleteExpense = async(eid) => {
    try {
        const response = await api.delete(`/expense/${eid}`)
        return response.data
    } catch (error) {
        console.error('Delete expense error:', error)
        throw error
    }
}

const expenseService = {getAllExpenses, addExpense, updateExpense, deleteExpense}

export default expenseService