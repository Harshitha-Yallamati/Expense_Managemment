import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', credentials)
          const { user, token } = response.data
          
          set({ user, token, isLoading: false })
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          
          return { success: true }
        } catch (error) {
          let errorMessage = 'Login failed'
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error
          } else if (error.response?.status === 401) {
            errorMessage = 'Invalid email or password. Please try again.'
          } else if (error.response?.status === 400) {
            errorMessage = 'Please provide valid email and password.'
          } else if (error.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          }
          
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      // Signup action
      signup: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/signup', userData)
          const { user, token } = response.data
          
          set({ user, token, isLoading: false })
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          
          return { success: true }
        } catch (error) {
          let errorMessage = 'Signup failed'
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error
          } else if (error.response?.status === 409) {
            errorMessage = 'Email already exists. Please use a different email.'
          } else if (error.response?.status === 400) {
            errorMessage = 'Invalid data provided. Please check your information.'
          } else if (error.response?.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          }
          
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      // Logout action
      logout: () => {
        set({ user: null, token: null, error: null })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          set({ 
            token, 
            user: JSON.parse(user) 
          })
        }
      },

      // Set user manually (useful for testing or external auth)
      setUser: (user, token = null) => {
        set({ user, token: token || get().token })
        if (token) {
          localStorage.setItem('token', token)
        }
        localStorage.setItem('user', JSON.stringify(user))
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export { useAuthStore }

