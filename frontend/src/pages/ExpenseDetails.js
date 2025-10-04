import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      const response = await axios.get(`/expenses/${id}`);
      setExpense(response.data.expense);
      setLoading(false);
    } catch (error) {
      setError('Failed to load expense details');
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`/approval/${id}/approve`, { comments });
      setSuccess('Expense approved successfully!');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve expense');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      setError('Please provide rejection comments');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`/approval/${id}/reject`, { comments });
      setSuccess('Expense rejected successfully!');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject expense');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminOverride = async (action) => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`/approval/${id}/override`, { action, comments });
      setSuccess(`Expense ${action}d successfully (Admin Override)!`);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to override expense');
    } finally {
      setActionLoading(false);
    }
  };

  const canApprove = () => {
    if (!expense || !user) return false;
    
    return expense.approvalSteps.some(
      (step) =>
        step.approverId &&
        step.approverId === user.id &&
        step.status === 'PENDING'
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStepStatusIcon = (status) => {
    if (status === 'APPROVED') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'REJECTED') return <XCircle className="h-5 w-5 text-red-600" />;
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Expense not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{expense.category.replace('_', ' ')}</h1>
              <p className="text-primary-100">{expense.description}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                expense.status
              )}`}
            >
              {expense.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <DollarSign className="h-6 w-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {expense.companyCurrency} {expense.convertedAmount.toFixed(2)}
                </p>
                {expense.originalCurrency !== expense.companyCurrency && (
                  <p className="text-sm text-gray-500">
                    Original: {expense.originalCurrency} {expense.originalAmount.toFixed(2)}
                    <span className="ml-2 text-xs">
                      (Rate: {expense.exchangeRate.toFixed(4)})
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-6 w-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-6 w-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Submitted By</p>
                <p className="text-lg font-semibold text-gray-900">{expense.employee.name}</p>
                <p className="text-sm text-gray-500">{expense.employee.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Submitted On</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(expense.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Tag className="h-6 w-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-lg font-semibold text-gray-900">{expense.category.replace('_', ' ')}</p>
              </div>
            </div>

            {expense.receiptUrl && (
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Receipt</p>
                  <a
                    href={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}${expense.receiptUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Receipt
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Approval Steps */}
          {expense.approvalSteps && expense.approvalSteps.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow</h2>
              <div className="space-y-4">
                {expense.approvalSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">{getStepStatusIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            Step {step.stepNumber}: {step.approverRole}
                          </p>
                          {step.approver && (
                            <p className="text-sm text-gray-600">
                              {step.approver.name} ({step.approver.email})
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            step.status
                          )}`}
                        >
                          {step.status.replace('_', ' ')}
                        </span>
                      </div>
                      {step.comments && (
                        <p className="mt-2 text-sm text-gray-700 italic">"{step.comments}"</p>
                      )}
                      {step.approvedAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(step.approvedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval Actions */}
          {canApprove() && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (Optional for approval, required for rejection)
                  </label>
                  <textarea
                    rows="3"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add your comments here..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>{actionLoading ? 'Processing...' : 'Approve'}</span>
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>{actionLoading ? 'Processing...' : 'Reject'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Override */}
          {user && user.role === 'ADMIN' && expense.status !== 'APPROVED' && expense.status !== 'REJECTED' && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-900">Admin Override</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      As an admin, you can override the approval workflow
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Override Comments
                  </label>
                  <textarea
                    rows="2"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Reason for override..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAdminOverride('approve')}
                    disabled={actionLoading}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {actionLoading ? 'Processing...' : 'Override & Approve'}
                  </button>
                  <button
                    onClick={() => handleAdminOverride('reject')}
                    disabled={actionLoading}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {actionLoading ? 'Processing...' : 'Override & Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;