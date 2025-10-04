import { useState } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'

const Rules = () => {
  const [rules] = useState([
    {
      id: 1,
      name: 'Meal Expense Limit',
      description: 'Maximum $50 per meal for client meetings',
      category: 'Meals',
      amount: 50,
      status: 'Active',
      createdAt: '2023-06-15'
    },
    {
      id: 2,
      name: 'Travel Expense Limit',
      description: 'Maximum $200 per day for business travel',
      category: 'Travel',
      amount: 200,
      status: 'Active',
      createdAt: '2023-05-20'
    },
    {
      id: 3,
      name: 'Office Supplies Limit',
      description: 'Maximum $100 per month for office supplies',
      category: 'Office Supplies',
      amount: 100,
      status: 'Inactive',
      createdAt: '2023-07-01'
    },
    {
      id: 4,
      name: 'Transportation Limit',
      description: 'Maximum $30 per trip for local transportation',
      category: 'Transportation',
      amount: 30,
      status: 'Active',
      createdAt: '2023-04-10'
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState(null)

  const columns = [
    {
      key: 'name',
      header: 'Rule Name',
      sortable: true
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount Limit',
      sortable: true,
      render: (value) => `$${value}`
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800'
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
          <button 
            onClick={() => {
              setSelectedRule(row)
              setIsModalOpen(true)
            }}
            className="text-blue-600 hover:text-blue-900 text-sm"
          >
            Edit
          </button>
          <button className="text-red-600 hover:text-red-900 text-sm">
            Delete
          </button>
        </div>
      )
    }
  ]

  const handleRowClick = (row) => {
    setSelectedRule(row)
    setIsModalOpen(true)
  }

  const handleSort = (field, direction) => {
    console.log('Sort by:', field, direction)
  }

  const stats = [
    { name: 'Total Rules', value: rules.length, change: '+1', changeType: 'positive' },
    { name: 'Active Rules', value: rules.filter(r => r.status === 'Active').length, change: '0', changeType: 'neutral' },
    { name: 'Categories', value: new Set(rules.map(r => r.category)).size, change: '+1', changeType: 'positive' },
    { name: 'Avg Limit', value: `$${Math.round(rules.reduce((sum, r) => sum + r.amount, 0) / rules.length)}`, change: '+$5', changeType: 'positive' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Rules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure expense approval rules and limits.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add New Rule
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⚙️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rules Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Table
            data={rules}
            columns={columns}
            onRowClick={handleRowClick}
            sortable={true}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Rule Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Rule"
        size="md"
      >
        {selectedRule && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rule Name
              </label>
              <input
                type="text"
                defaultValue={selectedRule.name}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                defaultValue={selectedRule.description}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="Meals" selected={selectedRule.category === 'Meals'}>Meals</option>
                  <option value="Travel" selected={selectedRule.category === 'Travel'}>Travel</option>
                  <option value="Office Supplies" selected={selectedRule.category === 'Office Supplies'}>Office Supplies</option>
                  <option value="Transportation" selected={selectedRule.category === 'Transportation'}>Transportation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount Limit
                </label>
                <input
                  type="number"
                  defaultValue={selectedRule.amount}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Active" selected={selectedRule.status === 'Active'}>Active</option>
                <option value="Inactive" selected={selectedRule.status === 'Inactive'}>Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Rules
