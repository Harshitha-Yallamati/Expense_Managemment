import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitExpense from './pages/SubmitExpense';
import ExpenseDetails from './pages/ExpenseDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/employee" element={
              <PrivateRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/manager" element={
              <PrivateRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/submit-expense" element={
              <PrivateRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <SubmitExpense />
              </PrivateRoute>
            } />
            
            <Route path="/expense/:id" element={
              <PrivateRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <ExpenseDetails />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;