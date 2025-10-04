# Authentication System Documentation

This document describes the comprehensive authentication system implemented with React Router DOM, Zustand state management, and Axios API integration.

## 🔐 Authentication Store (`authStore.js`)

### Fields
- `user`: Current authenticated user object
- `token`: JWT authentication token
- `isLoading`: Loading state for async operations
- `error`: Error messages from API calls

### Methods
- `login(credentials)`: Authenticate user with email/password
- `signup(userData)`: Create new user account
- `logout()`: Clear authentication state
- `setUser(user, token)`: Manually set user (useful for testing)
- `initializeAuth()`: Initialize auth state from localStorage
- `clearError()`: Clear error messages

## 📝 Form Fields

### Login Form
- `email`: User's email address
- `password`: User's password

### Signup Form
- `companyName`: Company/organization name
- `name`: User's full name
- `email`: User's email address
- `password`: User's password
- `confirmPassword`: Password confirmation
- `role`: User role (employee, manager, admin)

## 🛡️ Form Validation

### Validation Rules
- **Email**: Valid email format required
- **Password**: Minimum 6 characters
- **Name**: Minimum 2 characters
- **Company Name**: Minimum 2 characters
- **Confirm Password**: Must match password

### Validation Functions
```javascript
import { validateLoginForm, validateSignupForm } from '../utils/validation'

// Login validation
const { isValid, errors } = validateLoginForm(formData)

// Signup validation
const { isValid, errors } = validateSignupForm(formData)
```

## 🍞 Toast Notifications

### Toast Types
- `error`: Red toast for errors
- `success`: Green toast for success messages
- `warning`: Yellow toast for warnings
- `info`: Blue toast for information

### Usage
```javascript
import Toast, { useToast } from '../components/Toast'

const { toast, showToast, hideToast } = useToast()

// Show success message
showToast('Login successful!', 'success')

// Show error message
showToast('Invalid credentials', 'error')
```

## 🌐 API Integration

### Endpoints
- `POST /api/auth/login`: User authentication
- `POST /api/auth/signup`: User registration

### Request/Response Format

#### Login Request
```javascript
{
  email: "user@example.com",
  password: "password123"
}
```

#### Signup Request
```javascript
{
  companyName: "Acme Corp",
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "employee"
}
```

#### Success Response
```javascript
{
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "employee",
    companyName: "Acme Corp"
  },
  token: "jwt_token_here"
}
```

## 🔄 Authentication Flow

### Login Flow
1. User enters email and password
2. Form validation runs client-side
3. If valid, API call to `/api/auth/login`
4. On success: Store user and token, redirect to dashboard
5. On error: Display error message via toast

### Signup Flow
1. User fills out registration form
2. Form validation runs client-side
3. If valid, API call to `/api/auth/signup`
4. On success: Store user and token, redirect to dashboard
5. On error: Display error message via toast

### Logout Flow
1. Clear user and token from store
2. Remove from localStorage
3. Redirect to login page

## 🎨 UI Components

### Login Page Features
- Email and password fields
- Real-time validation feedback
- Loading states with spinner
- Error display (inline + toast)
- "Forgot password" link
- Link to signup page

### Signup Page Features
- Company name field
- Full name field
- Email field
- Role selection dropdown
- Password and confirm password fields
- Real-time validation feedback
- Loading states with spinner
- Error display (inline + toast)
- Link to login page

## 🚀 Error Handling

### Client-Side Validation
- Real-time field validation
- Visual feedback with red borders
- Error messages below fields
- Prevents form submission if invalid

### Server-Side Error Handling
- HTTP status code handling
- Specific error messages for common scenarios
- Fallback error messages
- Toast notifications for user feedback

### Error Types
- **400**: Invalid data provided
- **401**: Invalid credentials
- **409**: Email already exists
- **500+**: Server errors

## 🧪 Testing

### Manual Testing with setUser
```javascript
import { useAuthStore } from '../stores/authStore'

const { setUser } = useAuthStore()

// Test admin user
setUser({
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  companyName: 'Test Company'
})

// Test manager user
setUser({
  id: 2,
  name: 'Manager User',
  email: 'manager@example.com',
  role: 'manager',
  companyName: 'Test Company'
})

// Test employee user
setUser({
  id: 3,
  name: 'Employee User',
  email: 'employee@example.com',
  role: 'employee',
  companyName: 'Test Company'
})
```

## 🔧 Customization

### Adding New Fields
1. Update form state in component
2. Add validation rules in `validation.js`
3. Update API request format
4. Update auth store if needed

### Custom Validation Rules
```javascript
// Add to validation.js
export const validateCustomField = (value) => {
  return value.length >= 3
}

export const validateCustomForm = (formData) => {
  const errors = {}
  
  if (!validateCustomField(formData.customField)) {
    errors.customField = 'Custom field must be at least 3 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

### Custom Toast Messages
```javascript
// Different toast types
showToast('Custom success message', 'success')
showToast('Custom error message', 'error')
showToast('Custom warning message', 'warning')
showToast('Custom info message', 'info')
```

## 📱 Responsive Design

Both login and signup pages are fully responsive:
- Mobile-first design approach
- Proper spacing and sizing
- Touch-friendly form elements
- Accessible form labels and inputs

## 🔒 Security Considerations

- Passwords are not stored in localStorage
- JWT tokens are stored securely
- Form validation prevents malicious input
- HTTPS should be used in production
- CSRF protection should be implemented on the backend
