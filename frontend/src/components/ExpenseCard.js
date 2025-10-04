import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, FileText, Clock } from 'lucide-react';

const ExpenseCard = ({ expense }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_REVIEW: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={() => navigate(`/expense/${expense.id}`)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{expense.category.replace('_', ' ')}</h3>
          <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
          {expense.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span className="font-semibold text-gray-900">
            {expense.companyCurrency} {expense.convertedAmount.toFixed(2)}
          </span>
          {expense.originalCurrency !== expense.companyCurrency && (
            <span className="ml-2 text-xs text-gray-500">
              (Original: {expense.originalCurrency} {expense.originalAmount.toFixed(2)})
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{new Date(expense.date).toLocaleDateString()}</span>
        </div>

        {expense.employee && (
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <span>{expense.employee.name}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>Submitted {new Date(expense.submittedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {expense.approvalSteps && expense.approvalSteps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Approval Progress:</p>
          <div className="flex space-x-1">
            {expense.approvalSteps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded ${
                  step.status === 'APPROVED'
                    ? 'bg-green-500'
                    : step.status === 'REJECTED'
                    ? 'bg-red-500'
                    : 'bg-gray-300'
                }`}
                title={`${step.approverRole}: ${step.status}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;