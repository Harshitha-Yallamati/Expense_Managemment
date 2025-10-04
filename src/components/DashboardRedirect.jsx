import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect } from 'react'

const DashboardRedirect = () => {
  const { user, token, initializeAuth } = useAuthStore()

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // If not authenticated, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  // Redirect to appropriate dashboard based on user role
  const roleRoutes = {
    admin: '/admin',
    manager: '/manager',
    employee: '/employee'
  }

  const dashboardRoute = roleRoutes[user.role] || '/employee'
  return <Navigate to={dashboardRoute} replace />
}

export default DashboardRedirect
