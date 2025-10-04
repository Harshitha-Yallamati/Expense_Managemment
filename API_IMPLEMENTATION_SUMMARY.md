# API Service & Mock Server Implementation Summary

## ✅ **Enhanced API Service (`src/services/api.js`)**

### **Features Implemented:**
- **Axios instance** with base URL from `VITE_API_URL` environment variable
- **Authorization interceptor** that automatically adds `Bearer <token>` header
- **Response interceptor** for handling 401 errors and automatic logout
- **Organized API methods** for different endpoints:
  - `authAPI` - Authentication endpoints
  - `expensesAPI` - Expense management
  - `usersAPI` - User management  
  - `rulesAPI` - Expense rules
  - `dashboardAPI` - Dashboard statistics

### **Environment Configuration:**
```env
# MSW (default)
VITE_API_URL=http://localhost:3000/api

# json-server
VITE_API_URL=http://localhost:3001/api

# Production
VITE_API_URL=https://your-api-domain.com/api
```

## 🎭 **Option A: MSW (Mock Service Worker)**

### **Files Created:**
- `src/mocks/handlers.js` - Comprehensive API handlers
- `src/mocks/browser.js` - Browser worker setup
- `src/mocks/index.js` - MSW initialization
- Updated `src/main.jsx` - MSW initialization in development

### **Features:**
- **Realistic API simulation** with proper HTTP status codes
- **Authentication flow** with JWT token generation
- **CRUD operations** for all entities
- **Error handling** with appropriate error messages
- **No additional server** required

### **Quick Start:**
```bash
npm run dev
# MSW automatically intercepts API calls
```

### **Test Credentials:**
```javascript
// All users use password: "password123"
{
  email: "john@example.com",    // employee
  email: "jane@example.com",    // manager  
  email: "mike@example.com"    // admin
}
```

## 🗄️ **Option B: json-server**

### **Files Created:**
- `db.json` - Comprehensive sample data
- `routes.json` - Custom route mapping
- Updated `package.json` - Added mock server scripts

### **Features:**
- **Full REST API** with automatic CRUD operations
- **Database persistence** (data persists between restarts)
- **Query parameters** support (filtering, sorting, pagination)
- **Real HTTP server** on port 3001

### **Quick Start:**
```bash
# Start json-server
npm run mock-server

# Or start both servers simultaneously
npm run dev:mock
```

### **Available Scripts:**
- `npm run mock-server` - Start json-server on port 3001
- `npm run dev:mock` - Start both React app and json-server

## 📊 **Sample Data Included**

### **Users (5 total):**
- John Doe (employee) - john@example.com
- Jane Smith (manager) - jane@example.com  
- Mike Johnson (admin) - mike@example.com
- Sarah Wilson (employee) - sarah@example.com
- David Brown (manager) - david@example.com

### **Expenses (6 total):**
- Client Lunch ($75) - approved
- Taxi Fare ($25) - pending
- Office Supplies ($45) - approved
- Hotel Stay ($150) - rejected
- Conference Registration ($300) - approved
- Team Dinner ($120) - pending

### **Rules (6 total):**
- Meal Expense Limit ($50) - active
- Travel Expense Limit ($200) - active
- Office Supplies Limit ($100) - inactive
- Transportation Limit ($30) - active
- Accommodation Limit ($150) - active
- Training Limit ($500) - active

## 🔄 **Switching Between Options**

### **To use MSW:**
1. Set `VITE_API_URL=http://localhost:3000/api` in `.env`
2. Run `npm run dev`
3. MSW handles all API calls automatically

### **To use json-server:**
1. Set `VITE_API_URL=http://localhost:3001/api` in `.env`
2. Run `npm run mock-server` (in one terminal)
3. Run `npm run dev` (in another terminal)

## 🚀 **API Endpoints Available**

### **Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### **Users:**
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **Expenses:**
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PATCH /api/expenses/:id/approve` - Approve expense
- `PATCH /api/expenses/:id/reject` - Reject expense

### **Rules:**
- `GET /api/rules` - Get all rules
- `GET /api/rules/:id` - Get rule by ID
- `POST /api/rules` - Create new rule
- `PUT /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule

### **Dashboard:**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

## 🧪 **Testing Examples**

### **Using API Service:**
```javascript
import { authAPI, expensesAPI } from './services/api'

// Login
const result = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
})

// Get pending expenses
const expenses = await expensesAPI.getAll({ status: 'pending' })
```

### **Direct API Calls:**
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
})
```

## 🔧 **Customization**

### **Adding New Endpoints (MSW):**
Add to `src/mocks/handlers.js`:
```javascript
http.get('/api/custom-endpoint', () => {
  return HttpResponse.json({ data: 'custom response' })
})
```

### **Adding New Data (json-server):**
Add to `db.json`:
```json
{
  "users": [...],
  "customData": [
    { "id": 1, "name": "Custom Item" }
  ]
}
```

## 📝 **Recommendations**

- **MSW** is better for realistic API simulation and testing
- **json-server** is better for rapid prototyping and data persistence
- Both options work seamlessly with the existing authentication system
- Environment variables allow easy switching between mock and real APIs

## 🎯 **Next Steps**

1. **Choose your preferred option** (MSW or json-server)
2. **Set the appropriate environment variable**
3. **Start development** with the chosen mock server
4. **Test authentication flow** with provided credentials
5. **Customize data** as needed for your specific requirements

The mock server setup is now complete and ready for frontend-first development! 🚀
