import { useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../../components/Table'

const ExpenseList = () => {
  const [expenses] = useState([
    {
      id: 1,
      description: 'Client Lunch',
      amount: 75.00,
      category: 'Meals',
      date: '2024-01-15',
      status: 'Approved',
      notes: 'Meeting with potential client'
    },
    {
      id: 2,
      description: 'Taxi Fare',
      amount: 25.00,
      category: 'Transportation',
      date: '2024-01-14',
      status: 'Pending',
      notes: 'Airport to office'
    },
    {
      id: 3,
      description: 'Office Supplies',
      amount: 45.00,
      category: 'Office Supplies',
      date: '2024-01-13',
      status: 'Approved',
      notes: 'Printer paper and pens'
    },
    {
      id: 4,
      description: 'Hotel Stay',
      amount: 150.00,
      category: 'Accommodation',
      date: '2024-01-12',
      status: 'Rejected',
      notes: 'Business trip accommodation'
    },
  ])

  const columns = [
    {
      key: 'description',
      header: 'Description',
      sortable: true
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Approved' 
            ? 'bg-green-100 text-green-800'
            : value === 'Pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900 text-sm">
            View
          </button>
          {row.status === 'Pending' && (
            <button className="text-red-600 hover:text-red-900 text-sm">
              Cancel
            </button>
          )}
        </div>
      )
    }
  ]

  const handleRowClick = (row) => {
    console.log('Row clicked:', row)
  }

  const handleSort = (field, direction) => {
    console.log('Sort by:', field, direction)
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const approvedAmount = expenses
    .filter(expense => expense.status === 'Approved')
    .reduce((sum, expense) => sum + expense.amount, 0)
  const pendingAmount = expenses
    .filter(expense => expense.status === 'Pending')
    .reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense List</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your submitted expenses.
          </p>
        </div>
        <Link
          to="/expenses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Amount
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalAmount.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${approvedAmount.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${pendingAmount.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Table
            data={expenses}
            columns={columns}
            onRowClick={handleRowClick}
            sortable={true}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  )
}

export default ExpenseList

