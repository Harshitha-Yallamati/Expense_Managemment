import { http, HttpResponse } from 'msw'

// Mock data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'employee',
    companyName: 'Acme Corp',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-15T09:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    companyName: 'Acme Corp',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2023-05-20T08:30:00Z'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'admin',
    companyName: 'Acme Corp',
    status: 'active',
    lastLogin: '2024-01-15T11:00:00Z',
    createdAt: '2023-04-10T10:00:00Z'
  }
]

const expenses = [
  {
    id: 1,
    userId: 1,
    description: 'Client Lunch',
    amount: 75.00,
    category: 'Meals',
    date: '2024-01-15',
    status: 'approved',
    notes: 'Meeting with potential client',
    createdAt: '2024-01-15T14:30:00Z',
    approvedBy: 2,
    approvedAt: '2024-01-15T16:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    description: 'Taxi Fare',
    amount: 25.00,
    category: 'Transportation',
    date: '2024-01-14',
    status: 'pending',
    notes: 'Airport to office',
    createdAt: '2024-01-14T18:00:00Z'
  },
  {
    id: 3,
    userId: 2,
    description: 'Office Supplies',
    amount: 45.00,
    category: 'Office Supplies',
    date: '2024-01-13',
    status: 'approved',
    notes: 'Printer paper and pens',
    createdAt: '2024-01-13T10:00:00Z',
    approvedBy: 3,
    approvedAt: '2024-01-13T15:30:00Z'
  }
]

const rules = [
  {
    id: 1,
    name: 'Meal Expense Limit',
    description: 'Maximum $50 per meal for client meetings',
    category: 'Meals',
    amount: 50,
    status: 'active',
    createdAt: '2023-06-15T09:00:00Z'
  },
  {
    id: 2,
    name: 'Travel Expense Limit',
    description: 'Maximum $200 per day for business travel',
    category: 'Travel',
    amount: 200,
    status: 'active',
    createdAt: '2023-05-20T08:30:00Z'
  },
  {
    id: 3,
    name: 'Office Supplies Limit',
    description: 'Maximum $100 per month for office supplies',
    category: 'Office Supplies',
    amount: 100,
    status: 'inactive',
    createdAt: '2023-07-01T10:00:00Z'
  }
]

// Helper functions
const generateToken = (user) => {
  return `mock_token_${user.id}_${Date.now()}`
}

const findUserByEmail = (email) => {
  return users.find(user => user.email === email)
}

const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id))
}

// MSW Handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    
    const user = findUserByEmail(email)
    
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Mock password validation (in real app, this would be hashed)
    if (password !== 'password123') {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const token = generateToken(user)
    
    return HttpResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      },
      token
    })
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const userData = await request.json()
    
    // Check if email already exists
    if (findUserByEmail(userData.email)) {
      return HttpResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      )
    }
    
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    
    const token = generateToken(newUser)
    
    return HttpResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        companyName: newUser.companyName
      },
      token
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  // Users endpoints
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    
    let filteredUsers = [...users]
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }
    
    return HttpResponse.json({
      users: filteredUsers,
      total: filteredUsers.length
    })
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = findUserById(params.id)
    
    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ user })
  }),

  http.post('/api/users', async ({ request }) => {
    const userData = await request.json()
    
    if (findUserByEmail(userData.email)) {
      return HttpResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      )
    }
    
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    
    return HttpResponse.json({ user: newUser })
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const userData = await request.json()
    const userIndex = users.findIndex(user => user.id === parseInt(params.id))
    
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    users[userIndex] = { ...users[userIndex], ...userData }
    
    return HttpResponse.json({ user: users[userIndex] })
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const userIndex = users.findIndex(user => user.id === parseInt(params.id))
    
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    users.splice(userIndex, 1)
    
    return HttpResponse.json({ message: 'User deleted successfully' })
  }),

  // Expenses endpoints
  http.get('/api/expenses', ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const status = url.searchParams.get('status')
    const category = url.searchParams.get('category')
    
    let filteredExpenses = [...expenses]
    
    if (userId) {
      filteredExpenses = filteredExpenses.filter(expense => expense.userId === parseInt(userId))
    }
    
    if (status) {
      filteredExpenses = filteredExpenses.filter(expense => expense.status === status)
    }
    
    if (category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === category)
    }
    
    return HttpResponse.json({
      expenses: filteredExpenses,
      total: filteredExpenses.length
    })
  }),

  http.get('/api/expenses/:id', ({ params }) => {
    const expense = expenses.find(expense => expense.id === parseInt(params.id))
    
    if (!expense) {
      return HttpResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ expense })
  }),

  http.post('/api/expenses', async ({ request }) => {
    const expenseData = await request.json()
    
    const newExpense = {
      id: expenses.length + 1,
      ...expenseData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    expenses.push(newExpense)
    
    return HttpResponse.json({ expense: newExpense })
  }),

  http.put('/api/expenses/:id', async ({ params, request }) => {
    const expenseData = await request.json()
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(params.id))
    
    if (expenseIndex === -1) {
      return HttpResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      )
    }
    
    expenses[expenseIndex] = { ...expenses[expenseIndex], ...expenseData }
    
    return HttpResponse.json({ expense: expenses[expenseIndex] })
  }),

  http.delete('/api/expenses/:id', ({ params }) => {
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(params.id))
    
    if (expenseIndex === -1) {
      return HttpResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      )
    }
    
    expenses.splice(expenseIndex, 1)
    
    return HttpResponse.json({ message: 'Expense deleted successfully' })
  }),

  http.patch('/api/expenses/:id/approve', ({ params }) => {
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(params.id))
    
    if (expenseIndex === -1) {
      return HttpResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      )
    }
    
    expenses[expenseIndex].status = 'approved'
    expenses[expenseIndex].approvedAt = new Date().toISOString()
    expenses[expenseIndex].approvedBy = 2 // Mock approver ID
    
    return HttpResponse.json({ expense: expenses[expenseIndex] })
  }),

  http.patch('/api/expenses/:id/reject', async ({ params, request }) => {
    const { reason } = await request.json()
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(params.id))
    
    if (expenseIndex === -1) {
      return HttpResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      )
    }
    
    expenses[expenseIndex].status = 'rejected'
    expenses[expenseIndex].rejectedAt = new Date().toISOString()
    expenses[expenseIndex].rejectedBy = 2 // Mock rejector ID
    expenses[expenseIndex].rejectionReason = reason
    
    return HttpResponse.json({ expense: expenses[expenseIndex] })
  }),

  // Rules endpoints
  http.get('/api/rules', () => {
    return HttpResponse.json({
      rules,
      total: rules.length
    })
  }),

  http.get('/api/rules/:id', ({ params }) => {
    const rule = rules.find(rule => rule.id === parseInt(params.id))
    
    if (!rule) {
      return HttpResponse.json(
        { message: 'Rule not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ rule })
  }),

  http.post('/api/rules', async ({ request }) => {
    const ruleData = await request.json()
    
    const newRule = {
      id: rules.length + 1,
      ...ruleData,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    rules.push(newRule)
    
    return HttpResponse.json({ rule: newRule })
  }),

  http.put('/api/rules/:id', async ({ params, request }) => {
    const ruleData = await request.json()
    const ruleIndex = rules.findIndex(rule => rule.id === parseInt(params.id))
    
    if (ruleIndex === -1) {
      return HttpResponse.json(
        { message: 'Rule not found' },
        { status: 404 }
      )
    }
    
    rules[ruleIndex] = { ...rules[ruleIndex], ...ruleData }
    
    return HttpResponse.json({ rule: rules[ruleIndex] })
  }),

  http.delete('/api/rules/:id', ({ params }) => {
    const ruleIndex = rules.findIndex(rule => rule.id === parseInt(params.id))
    
    if (ruleIndex === -1) {
      return HttpResponse.json(
        { message: 'Rule not found' },
        { status: 404 }
      )
    }
    
    rules.splice(ruleIndex, 1)
    
    return HttpResponse.json({ message: 'Rule deleted successfully' })
  }),

  // Dashboard endpoints
  http.get('/api/dashboard/stats', () => {
    const stats = {
      totalUsers: users.length,
      totalExpenses: expenses.length,
      pendingExpenses: expenses.filter(e => e.status === 'pending').length,
      approvedExpenses: expenses.filter(e => e.status === 'approved').length,
      totalExpenseAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
      activeRules: rules.filter(r => r.status === 'active').length
    }
    
    return HttpResponse.json({ stats })
  }),

  http.get('/api/dashboard/activity', () => {
    const activities = [
      {
        id: 1,
        type: 'expense_created',
        description: 'New expense submitted',
        userId: 1,
        userName: 'John Doe',
        createdAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 2,
        type: 'expense_approved',
        description: 'Expense approved',
        userId: 2,
        userName: 'Jane Smith',
        createdAt: '2024-01-15T16:00:00Z'
      }
    ]
    
    return HttpResponse.json({ activities })
  })
]
