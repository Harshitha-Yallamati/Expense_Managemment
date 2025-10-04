# Client-Side Routing with React Router DOM

This project implements comprehensive client-side routing with role-based access control using React Router v6 and Zustand for state management.

## 🔐 Authentication Store (`authStore.js`)

The authentication store provides the following fields and methods:

```javascript
const { 
  user,           // Current user object
  token,          // Authentication token
  isLoading,      // Loading state
  error,          // Error messages
  login,          // Login function
  logout,         // Logout function
  signup,         // Signup function
  setUser,        // Manually set user (useful for testing)
  initializeAuth, // Initialize auth from localStorage
  clearError      // Clear error messages
} = useAuthStore()
```

### Example Usage:

```javascript
// Login
const result = await login({ email: 'user@example.com', password: 'password' })

// Set user manually (for testing)
setUser({ 
  id: 1, 
  name: 'John Doe', 
  email: 'john@example.com', 
  role: 'admin' 
})

// Logout
logout()
```

## 🛡️ Protected Route Components

### 1. `ProtectedRoute` Component

Basic authentication protection for any route:

```jsx
import ProtectedRoute from './components/ProtectedRoute'

// Basic protection - requires authentication
<ProtectedRoute>
  <SomeComponent />
</ProtectedRoute>

// Role-specific protection
<ProtectedRoute requiredRole="admin">
  <AdminOnlyComponent />
</ProtectedRoute>
```

### 2. `RoleProtectedRoute` Component

Advanced role-based access control:

```jsx
import { AdminRoute, ManagerRoute, EmployeeRoute } from './components/RoleProtectedRoute'

// Admin-only routes
<AdminRoute>
  <AdminDashboard />
</AdminRoute>

// Manager and Admin routes
<ManagerRoute>
  <ManagerDashboard />
</ManagerRoute>

// All authenticated users
<EmployeeRoute>
  <EmployeeDashboard />
</EmployeeRoute>

// Custom role requirements
<RoleProtectedRoute allowedRoles={['admin', 'manager']}>
  <SomeComponent />
</RoleProtectedRoute>
```

## 🗺️ Route Structure

### Public Routes
- `/login` - Login page
- `/signup` - Registration page

### Protected Routes

#### Root Route
- `/` - Redirects to appropriate dashboard based on user role

#### Admin Routes (`/admin/*`)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/rules` - Expense rules configuration

#### Manager Routes (`/manager/*`)
- `/manager` - Manager dashboard

#### Employee Routes (`/employee/*`)
- `/employee` - Employee dashboard

#### Expense Routes (`/expenses/*`)
- `/expenses` - Expense list
- `/expenses/new` - Create new expense

## 🔄 Role-Based Redirects

The system automatically redirects users based on their roles:

```javascript
// Role mapping
const roleRoutes = {
  admin: '/admin',
  manager: '/manager',
  employee: '/employee'
}
```

### Redirect Behavior:
- **Unauthenticated users** → `/login`
- **Admin users** → `/admin`
- **Manager users** → `/manager`
- **Employee users** → `/employee`
- **Unauthorized access** → Appropriate dashboard for user's role

## 📝 Example Usage

### Admin-Only Route Example:

```jsx
// In App.jsx
<Route path="/admin/*" element={
  <AdminRoute>
    <Layout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="rules" element={<Rules />} />
      </Routes>
    </Layout>
  </AdminRoute>
} />
```

### Testing Authentication:

```javascript
// Set up test user
const { setUser } = useAuthStore()

// Test admin user
setUser({
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
})

// Test manager user
setUser({
  id: 2,
  name: 'Manager User',
  email: 'manager@example.com',
  role: 'manager'
})

// Test employee user
setUser({
  id: 3,
  name: 'Employee User',
  email: 'employee@example.com',
  role: 'employee'
})
```

## 🚀 Features

- **Automatic Authentication**: Routes automatically check auth state
- **Role-Based Access**: Different access levels for admin, manager, employee
- **Persistent Sessions**: Auth state persists across browser refreshes
- **Smart Redirects**: Users are redirected to appropriate dashboards
- **Nested Routes**: Support for nested route structures
- **Fallback Handling**: Graceful handling of unauthorized access
- **Type Safety**: TypeScript-ready component interfaces

## 🔧 Customization

### Adding New Roles:

1. Update the role mapping in `ProtectedRoute.jsx`:
```javascript
const roleRoutes = {
  admin: '/admin',
  manager: '/manager',
  employee: '/employee',
  supervisor: '/supervisor'  // New role
}
```

2. Create new route component:
```jsx
export const SupervisorRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['admin', 'supervisor']}>
    {children}
  </RoleProtectedRoute>
)
```

3. Add routes in `App.jsx`:
```jsx
<Route path="/supervisor/*" element={
  <SupervisorRoute>
    <Layout>
      <SupervisorDashboard />
    </Layout>
  </SupervisorRoute>
} />
```
