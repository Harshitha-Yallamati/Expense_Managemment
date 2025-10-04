import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect } from 'react'

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login',
  fallbackRoute = null 
}) => {
  const { user, token, initializeAuth } = useAuthStore()
  const location = useLocation()

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check if specific role is required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const roleRoutes = {
      admin: '/admin',
      manager: '/manager', 
      employee: '/employee'
    }
    
    const fallback = fallbackRoute || roleRoutes[user.role] || '/'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute

