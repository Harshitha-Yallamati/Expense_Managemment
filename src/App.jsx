import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AdminRoute, ManagerRoute, EmployeeRoute } from './components/RoleProtectedRoute'
import DashboardRedirect from './components/DashboardRedirect'
import Layout from './components/Layout'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Dashboard Pages
import AdminDashboard from './pages/dashboards/AdminDashboard'
import ManagerDashboard from './pages/dashboards/ManagerDashboard'
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard'

// Expense Pages
import NewExpense from './pages/expenses/NewExpense'
import ExpenseList from './pages/expenses/ExpenseList'

// Admin Pages
import Users from './pages/admin/Users'
import Rules from './pages/admin/Rules'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Root route - redirects to appropriate dashboard based on role */}
          <Route path="/" element={<DashboardRedirect />} />
          
          {/* Admin Routes - Only accessible by admin users */}
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
          
          {/* Manager Routes - Accessible by admin and manager users */}
          <Route path="/manager/*" element={
            <ManagerRoute>
              <Layout>
                <Routes>
                  <Route index element={<ManagerDashboard />} />
                </Routes>
              </Layout>
            </ManagerRoute>
          } />
          
          {/* Employee Routes - Accessible by all authenticated users */}
          <Route path="/employee/*" element={
            <EmployeeRoute>
              <Layout>
                <Routes>
                  <Route index element={<EmployeeDashboard />} />
                </Routes>
              </Layout>
            </EmployeeRoute>
          } />
          
          {/* Expense Routes - Accessible by all authenticated users */}
          <Route path="/expenses/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="new" element={<NewExpense />} />
                  <Route index element={<ExpenseList />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

