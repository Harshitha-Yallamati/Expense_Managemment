const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken } = require('../config/jwt');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register-company
// @desc    Register a new company with admin user
// @access  Public
router.post('/register-company', async (req, res) => {
  try {
    const { companyName, adminName, adminEmail, password, defaultCurrency } = req.body;

    if (!companyName || !adminName || !adminEmail || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if company exists
    const companyExists = await prisma.company.findUnique({
      where: { name: companyName }
    });
    
    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user and company in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const admin = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          company: companyName,
        },
      });

      const company = await tx.company.create({
        data: {
          name: companyName,
          defaultCurrency: defaultCurrency || 'USD',
          adminId: admin.id,
          workflowType: 'SEQUENTIAL',
          percentageRequired: 100,
        },
      });

      return { admin, company };
    });

    const token = generateToken(result.admin.id);

    res.status(201).json({
      message: 'Company and admin user created successfully',
      token,
      user: {
        id: result.admin.id,
        name: result.admin.name,
        email: result.admin.email,
        role: result.admin.role,
        company: result.admin.company,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (Employee/Manager)
// @access  Private (Admin only)
router.post('/register', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!['EMPLOYEE', 'MANAGER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (role === 'EMPLOYEE' && !managerId) {
      return res.status(400).json({ message: 'Manager ID is required for Employee role' });
    }

    if (managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: managerId }
      });
      
      if (!manager || (manager.role !== 'MANAGER' && manager.role !== 'ADMIN')) {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        company: req.user.company,
        managerId: managerId || null,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        managerId: user.managerId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for:', email);
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }
  
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          company: true,
          managerId: true,
          isActive: true,
        }
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      if (!user.isActive) {
        return res.status(401).json({ message: 'User account is inactive' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = generateToken(user.id);
  
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          managerId: user.managerId,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        managerId: true,
        isActive: true,
        createdAt: true,
      }
    });
    
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users in company
// @access  Private (Admin only)
router.get('/users', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { company: req.user.company },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        managerId: true,
        isActive: true,
        createdAt: true,
      }
    });
    
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/managers
// @desc    Get all managers in company
// @access  Private (Admin only)
router.get('/managers', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const managers = await prisma.user.findMany({
      where: {
        company: req.user.company,
        role: { in: ['MANAGER', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
      }
    });
    
    res.json({ managers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;