# Mock Server Setup Guide

This guide provides two options for setting up mock servers for frontend-first development: MSW (Mock Service Worker) and json-server.

## 🔧 Enhanced API Service

The `src/services/api.js` file provides a comprehensive axios instance with:

- **Base URL** from environment variable (`VITE_API_URL`)
- **Authorization header** with Bearer token
- **Request/Response interceptors** for error handling
- **Organized API methods** for different endpoints

### Environment Variables

Create a `.env` file in your project root:

```env
# For MSW (development)
VITE_API_URL=http://localhost:3000/api

# For json-server
VITE_API_URL=http://localhost:3001/api

# For production
VITE_API_URL=https://your-api-domain.com/api
```

## 🎭 Option A: MSW (Mock Service Worker)

MSW intercepts network requests at the service worker level, providing realistic API mocking.

### Setup

1. **Install MSW** (already done):
   ```bash
   npm install --save-dev msw
   ```

2. **Files Created**:
   - `src/mocks/handlers.js` - API endpoint handlers
   - `src/mocks/browser.js` - Browser worker setup
   - `src/mocks/index.js` - MSW initialization
   - Updated `src/main.jsx` - MSW initialization

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Features

- **Realistic API responses** with proper HTTP status codes
- **Authentication simulation** with JWT tokens
- **CRUD operations** for all entities
- **Error handling** with appropriate error messages
- **No additional server** required

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

#### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PATCH /api/expenses/:id/approve` - Approve expense
- `PATCH /api/expenses/:id/reject` - Reject expense

#### Rules
- `GET /api/rules` - Get all rules
- `GET /api/rules/:id` - Get rule by ID
- `POST /api/rules` - Create new rule
- `PUT /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

### Test Credentials

```javascript
// Login with these credentials
{
  email: "john@example.com",
  password: "password123"
}

// Or
{
  email: "jane@example.com", 
  password: "password123"
}

// Or
{
  email: "mike@example.com",
  password: "password123"
}
```

## 🗄️ Option B: json-server

json-server provides a full REST API from a JSON file with minimal setup.

### Setup

1. **Install json-server** (already done):
   ```bash
   npm install --save-dev json-server
   ```

2. **Add npm scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "mock-server": "json-server --watch db.json --port 3001 --routes routes.json",
       "dev:mock": "concurrently \"npm run dev\" \"npm run mock-server\""
     }
   }
   ```

3. **Create routes.json** for custom routes:
   ```json
   {
     "/api/*": "/$1"
   }
   ```

4. **Start json-server**:
   ```bash
   npm run mock-server
   ```

5. **Start both servers** (optional):
   ```bash
   npm run dev:mock
   ```

### Features

- **Full REST API** with automatic CRUD operations
- **Database persistence** (data persists between restarts)
- **Query parameters** support (filtering, sorting, pagination)
- **Custom routes** support
- **Real HTTP server** on port 3001

### Available Endpoints

All endpoints are automatically generated from `db.json`:

- `GET /api/users` - Get all users
- `GET /api/users/1` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/1` - Update user
- `DELETE /api/users/1` - Delete user

Same pattern for `expenses`, `rules`, and `dashboard`.

### Query Examples

```bash
# Filter users by role
GET /api/users?role=admin

# Filter expenses by status
GET /api/expenses?status=pending

# Filter expenses by user
GET /api/expenses?userId=1

# Sort expenses by amount
GET /api/expenses?_sort=amount&_order=desc

# Paginate results
GET /api/expenses?_page=1&_limit=10
```

## 🚀 Quick Start Commands

### MSW Setup
```bash
# 1. Install dependencies (already done)
npm install --save-dev msw

# 2. Start development server
npm run dev

# 3. MSW will automatically intercept API calls
```

### json-server Setup
```bash
# 1. Install dependencies (already done)
npm install --save-dev json-server

# 2. Start json-server
npm run mock-server

# 3. In another terminal, start React app
npm run dev
```

## 🔄 Switching Between Options

### To use MSW:
1. Set `VITE_API_URL=http://localhost:3000/api` in `.env`
2. Start with `npm run dev`
3. MSW will handle all API calls

### To use json-server:
1. Set `VITE_API_URL=http://localhost:3001/api` in `.env`
2. Start json-server with `npm run mock-server`
3. Start React app with `npm run dev`

## 📊 Sample Data

Both options include comprehensive sample data:

- **5 users** with different roles (admin, manager, employee)
- **6 expenses** with various statuses (pending, approved, rejected)
- **6 rules** for different expense categories
- **Dashboard statistics** and recent activity

## 🧪 Testing

### Manual Testing
```javascript
// Test login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
})

const data = await response.json()
console.log(data) // { user: {...}, token: "..." }
```

### Using API Service
```javascript
import { authAPI, expensesAPI } from './services/api'

// Login
const result = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
})

// Get expenses
const expenses = await expensesAPI.getAll({ status: 'pending' })
```

## 🔧 Customization

### Adding New Endpoints (MSW)
Add handlers to `src/mocks/handlers.js`:

```javascript
http.get('/api/custom-endpoint', () => {
  return HttpResponse.json({ data: 'custom response' })
})
```

### Adding New Data (json-server)
Add new collections to `db.json`:

```json
{
  "users": [...],
  "customData": [
    { "id": 1, "name": "Custom Item" }
  ]
}
```

## 🚨 Troubleshooting

### MSW Issues
- Ensure MSW is only initialized in development
- Check browser console for service worker errors
- Verify handlers are properly exported

### json-server Issues
- Ensure port 3001 is available
- Check `db.json` syntax is valid JSON
- Verify routes.json is properly configured

## 📝 Notes

- **MSW** is better for realistic API simulation and testing
- **json-server** is better for rapid prototyping and data persistence
- Both options work seamlessly with the existing authentication system
- Environment variables allow easy switching between mock and real APIs
