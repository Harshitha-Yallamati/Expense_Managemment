const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const prisma = require('./config/prisma');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded receipts)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'receipts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expense'));
app.use('/api/approval', require('./routes/approval'));
app.use('/api/currency', require('./routes/currency'));

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      message: 'Server is running', 
      database: 'Connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server is running but database connection failed', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Database: PostgreSQL (Prisma)`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});