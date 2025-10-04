# React Vite Project

A modern React application built with Vite, featuring TailwindCSS, React Router v6, Axios, and Zustand for state management.

## Features

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 18** - Latest React with hooks
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🧭 **React Router v6** - Client-side routing
- 📡 **Axios** - HTTP client for API calls
- 🗃️ **Zustand** - Lightweight state management
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication** - Login/Signup with protected routes
- 📊 **Role-based Access** - Admin, Manager, Employee dashboards
- 💰 **Expense Management** - Create, view, and manage expenses
- 👥 **User Management** - Admin panel for user management
- ⚙️ **Rules Engine** - Configurable expense rules

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   ├── FileUpload.jsx
│   ├── Modal.jsx
│   └── Table.jsx
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── dashboards/     # Dashboard pages
│   │   ├── AdminDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   └── EmployeeDashboard.jsx
│   ├── expenses/       # Expense management
│   │   ├── NewExpense.jsx
│   │   └── ExpenseList.jsx
│   └── admin/          # Admin pages
│       ├── Users.jsx
│       └── Rules.jsx
├── services/           # API services
│   └── api.js
├── stores/             # State management
│   └── authStore.js
├── styles/             # Styles
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-vite-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - CSS framework
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Features Overview

### Authentication
- User login and signup
- Role-based access control (Admin, Manager, Employee)
- Protected routes
- Persistent authentication state

### Dashboards
- **Admin Dashboard**: Overview of all users, expenses, and system stats
- **Manager Dashboard**: Team management and expense approvals
- **Employee Dashboard**: Personal expense tracking

### Expense Management
- Create new expenses with file uploads
- View expense history with filtering and sorting
- Status tracking (Pending, Approved, Rejected)
- Category-based organization

### Admin Features
- User management (create, edit, delete users)
- Expense rules configuration
- System-wide statistics and reports

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
