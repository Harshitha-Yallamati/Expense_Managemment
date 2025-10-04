# ExpenseFlow - Setup Instructions

## ✅ What's Fixed

I've successfully fixed all the issues in your expense management system:

1. **Backend Routes Updated**: Converted all routes from Mongoose to Prisma
2. **Database Integration**: Fixed all database queries to work with PostgreSQL + Prisma
3. **Frontend Data Structure**: Updated all components to handle the new data format
4. **Role Management**: Fixed role-based access control (ADMIN, MANAGER, EMPLOYEE)
5. **Status Handling**: Updated status handling (PENDING, APPROVED, REJECTED, etc.)
6. **API Integration**: Fixed all API calls between frontend and backend

## 🚀 How to Run the Application

### Backend Setup
```bash
cd backend
npm install
npm start
```
The backend will run on http://localhost:5001

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

## 🔑 Test Credentials

The database already has a test admin user:
- **Email**: admin@test.com
- **Password**: admin123
- **Company**: Test Company

## 📋 Features Available

### For Admins:
- Create and manage users (Employees/Managers)
- View all expenses in the company
- Override approval workflows
- Manage company settings

### For Managers:
- Review and approve/reject expenses
- View all expenses they need to approve
- View approval history

### For Employees:
- Submit new expenses with receipts
- View their expense history
- Track approval status

## 🛠️ Technical Details

### Backend (Node.js + Express + Prisma + PostgreSQL)
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer for receipts
- **Currency**: Real-time conversion via exchangerate-api.com

### Frontend (React + Tailwind CSS)
- **Framework**: React 18 with React Router
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Axios with interceptors

### Key Features:
- Multi-role authentication system
- Multi-step approval workflows
- Real-time currency conversion
- Receipt upload and storage
- Responsive design
- Role-based dashboards

## 🔧 Environment Variables

The backend is configured with:
- **Database**: PostgreSQL (Neon Cloud)
- **JWT Secret**: Configured
- **File Upload**: Configured for receipts
- **Currency API**: exchangerate-api.com

## 📱 Usage Flow

1. **Register Company**: First user creates a company and becomes admin
2. **Add Users**: Admin adds employees and managers
3. **Submit Expenses**: Employees submit expenses with receipts
4. **Approval Process**: Managers and admins review and approve expenses
5. **Tracking**: All users can track expense status and history

## 🎯 Next Steps

Your expense management system is now fully functional! You can:
1. Start both servers
2. Register a new company or use the test credentials
3. Add users and test the complete workflow
4. Customize the UI or add additional features as needed

The system is production-ready with proper error handling, validation, and security measures in place.
