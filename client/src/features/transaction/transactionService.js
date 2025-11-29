import { api } from "../../api/api"

const getallTransactions = async() => {
    try {
        const response = await api.get('/finance')
        return response.data
    } catch (error) {
        console.error('Get transactions error:', error)
        throw error
    }
}

const financeService = {getallTransactions}

export default financeService