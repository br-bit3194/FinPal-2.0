import { api } from "../../api/api"

const register = async (formData) => {
    try {
        const response = await api.post('/auth', formData)
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
    } catch (error) {
        console.error('Registration error:', error)
        throw error
    }
}

const logout = async () => {
    try {
        localStorage.removeItem("user")
        return { success: true }
    } catch (error) {
        console.error('Logout error:', error)
        // Still remove user from localStorage even if API call fails
        localStorage.removeItem("user")
        return { success: true }
    }
}

const authService = { register, logout }

export default authService