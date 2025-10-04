const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const axios = require('axios');

// Currency conversion helper
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    if (fromCurrency === toCurrency) {
      return { convertedAmount: amount, exchangeRate: 1 };
    }

    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const rate = response.data.rates[toCurrency];
    
    if (!rate) {
      throw new Error('Currency conversion rate not found');
    }

    return {
      convertedAmount: amount * rate,
      exchangeRate: rate,
    };
  } catch (error) {
    console.error('Currency conversion error:', error.message);
    // Fallback to 1:1 conversion if API fails
    return { convertedAmount: amount, exchangeRate: 1 };
  }
};

// OCR placeholder function
const extractReceiptData = async (filePath) => {
  // Placeholder for Tesseract.js OCR implementation
  // In production, implement actual OCR logic here
  return {
    amount: null,
    date: null,
    vendor: null,
    category: null,
  };
};

// @route   POST /api/expenses
// @desc    Submit a new expense
// @access  Private (Employee, Manager, Admin)
router.post('/', protect, upload.single('receipt'), async (req, res) => {
  try {
    const { amount, category, description, date, currency } = req.body;

    // Validation
    if (!amount || !category || !description || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const originalCurrency = currency || 'USD';
    const companyCurrency = process.env.DEFAULT_CURRENCY || 'USD';

    // Convert currency
    const { convertedAmount, exchangeRate } = await convertCurrency(
      parseFloat(amount),
      originalCurrency,
      companyCurrency
    );

    // Get user's manager for approval workflow
    const employee = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { manager: true }
    });

    // Create approval steps
    const approvalSteps = [];
    let stepNumber = 1;

    if (employee.managerId) {
      approvalSteps.push({
        stepNumber: stepNumber++,
        approverRole: 'MANAGER',
        approverId: employee.managerId,
        status: 'PENDING',
        isMandatory: true,
      });
    }

    // Add admin approval step
    const admin = await prisma.user.findFirst({ 
      where: { 
        company: employee.company, 
        role: 'ADMIN' 
      } 
    });
    
    if (admin) {
      approvalSteps.push({
        stepNumber: stepNumber++,
        approverRole: 'ADMIN',
        approverId: admin.id,
        status: 'PENDING',
        isMandatory: true,
      });
    }

    // Create expense with approval steps
    const expense = await prisma.expense.create({
      data: {
        employeeId: req.user.id,
        amount: convertedAmount,
        originalAmount: parseFloat(amount),
        originalCurrency,
        convertedAmount,
        companyCurrency,
        exchangeRate,
        category: category.toUpperCase().replace(' ', '_'),
        description,
        date: new Date(date),
        receiptUrl: req.file ? `/uploads/receipts/${req.file.filename}` : null,
        status: 'PENDING',
        workflowType: 'SEQUENTIAL',
        percentageRequired: 100,
        approvalSteps: {
          create: approvalSteps
        }
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvalSteps: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Expense submitted successfully',
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/expenses/ocr
// @desc    Upload receipt and extract data using OCR
// @access  Private
router.post('/ocr', protect, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a receipt' });
    }

    // Extract data using OCR (placeholder)
    const extractedData = await extractReceiptData(req.file.path);

    res.json({
      message: 'Receipt processed successfully',
      data: extractedData,
      receiptUrl: `/uploads/receipts/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/expenses
// @desc    Get expenses (filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let whereClause = {};

    // Employee: see only their expenses
    if (req.user.role === 'EMPLOYEE') {
      whereClause.employeeId = req.user.id;
    }
    // Manager: see expenses they need to approve
    else if (req.user.role === 'MANAGER') {
      whereClause.approvalSteps = {
        some: {
          approverId: req.user.id
        }
      };
    }
    // Admin: see all expenses in company
    else if (req.user.role === 'ADMIN') {
      const companyUsers = await prisma.user.findMany({ 
        where: { company: req.user.company },
        select: { id: true }
      });
      const userIds = companyUsers.map(u => u.id);
      whereClause.employeeId = { in: userIds };
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvalSteps: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: req.params.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvalSteps: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check authorization
    const isEmployee = expense.employeeId === req.user.id;
    const isApprover = expense.approvalSteps.some(
      step => step.approverId === req.user.id
    );
    const isAdmin = req.user.role === 'ADMIN';

    if (!isEmployee && !isApprover && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }

    res.json({ expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/expenses/pending/count
// @desc    Get count of pending expenses for current user
// @access  Private
router.get('/pending/count', protect, async (req, res) => {
  try {
    let count = 0;

    if (req.user.role === 'MANAGER' || req.user.role === 'ADMIN') {
      count = await prisma.expense.count({
        where: {
          approvalSteps: {
            some: {
              approverId: req.user.id,
              status: 'PENDING',
            },
          },
        },
      });
    }

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;