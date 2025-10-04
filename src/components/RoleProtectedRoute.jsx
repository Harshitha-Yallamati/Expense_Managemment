import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect } from 'react'

const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login',
  unauthorizedRedirect = null 
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

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const roleRoutes = {
      admin: '/admin',
      manager: '/manager', 
      employee: '/employee'
    }
    
    const fallback = unauthorizedRedirect || roleRoutes[user.role] || '/'
    return <Navigate to={fallback} replace />
  }

  return children
}

// Convenience components for specific roles
export const AdminRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['admin']}>
    {children}
  </RoleProtectedRoute>
)

export const ManagerRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
    {children}
  </RoleProtectedRoute>
)

export const EmployeeRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
    {children}
  </RoleProtectedRoute>
)

export default RoleProtectedRoute
