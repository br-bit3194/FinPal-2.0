import { api } from "../../api/api"

const getAllIncomes = async() => {
    try {
        const response = await api.get('/income')
        return response.data
    } catch (error) {
        console.error('Get incomes error:', error)
        throw error
    }
}

//Add income
const addIncome = async(formData) => {
    try {
        const response = await api.post('/income', formData)
        return response.data
    } catch (error) {
        console.error('Add income error:', error)
        throw error
    }
}

//Update income
const updateIncome = async(formData, iid) => {
    try {
        const response = await api.put(`/income/${iid}`, formData)
        return response.data
    } catch (error) {
        console.error('Update income error:', error)
        throw error
    }
}

//Delete income
const deleteIncome = async(iid) => {
    try {
        const response = await api.delete(`/income/${iid}`)
        return response.data
    } catch (error) {
        console.error('Delete income error:', error)
        throw error
    }
}

const incomeService = {getAllIncomes, addIncome, updateIncome, deleteIncome}

export default incomeService