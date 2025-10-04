const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/approval/pending
// @desc    Get pending expenses for approval
// @access  Private (Manager, Admin)
router.get('/pending', protect, authorize('MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        approvalSteps: {
          some: {
            approverId: req.user.id,
            status: 'PENDING',
          },
        },
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
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/approval/:expenseId/approve
// @desc    Approve an expense
// @access  Private (Manager, Admin)
router.post('/:expenseId/approve', protect, authorize('MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const { comments } = req.body;
    const expense = await prisma.expense.findUnique({
      where: { id: req.params.expenseId },
      include: {
        approvalSteps: true
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find the approval step for current user
    const stepIndex = expense.approvalSteps.findIndex(
      step => step.approverId === req.user.id && step.status === 'PENDING'
    );

    if (stepIndex === -1) {
      return res.status(403).json({ message: 'You are not authorized to approve this expense or it has already been processed' });
    }

    // Update approval step
    await prisma.approvalStep.update({
      where: { id: expense.approvalSteps[stepIndex].id },
      data: {
        status: 'APPROVED',
        comments: comments || '',
        approvedAt: new Date(),
      }
    });

    // Check if all steps are approved
    const allApproved = await prisma.approvalStep.count({
      where: {
        expenseId: expense.id,
        status: 'APPROVED'
      }
    });

    const totalSteps = await prisma.approvalStep.count({
      where: {
        expenseId: expense.id
      }
    });
    
    let newStatus = 'IN_REVIEW';
    if (allApproved === totalSteps) {
      newStatus = 'APPROVED';
    }

    // Update expense status
    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: { status: newStatus },
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

    res.json({
      message: 'Expense approved successfully',
      expense: updatedExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/approval/:expenseId/reject
// @desc    Reject an expense
// @access  Private (Manager, Admin)
router.post('/:expenseId/reject', protect, authorize('MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const { comments } = req.body;

    if (!comments) {
      return res.status(400).json({ message: 'Please provide rejection comments' });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: req.params.expenseId },
      include: {
        approvalSteps: true
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find the approval step for current user
    const stepIndex = expense.approvalSteps.findIndex(
      step => step.approverId === req.user.id && step.status === 'PENDING'
    );

    if (stepIndex === -1) {
      return res.status(403).json({ message: 'You are not authorized to reject this expense or it has already been processed' });
    }

    // Update approval step
    await prisma.approvalStep.update({
      where: { id: expense.approvalSteps[stepIndex].id },
      data: {
        status: 'REJECTED',
        comments: comments,
        approvedAt: new Date(),
      }
    });

    // Mark expense as rejected
    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: { 
        status: 'REJECTED',
        finalComments: comments
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

    res.json({
      message: 'Expense rejected successfully',
      expense: updatedExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/approval/:expenseId/override
// @desc    Admin override - approve or reject regardless of workflow
// @access  Private (Admin only)
router.post('/:expenseId/override', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { action, comments } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Please provide valid action (approve/reject)' });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: req.params.expenseId },
      include: {
        approvalSteps: true
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Override all pending steps
    const pendingSteps = expense.approvalSteps.filter(step => step.status === 'PENDING');
    
    for (const step of pendingSteps) {
      await prisma.approvalStep.update({
        where: { id: step.id },
        data: {
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          comments: `Admin Override: ${comments || ''}`,
          approvedAt: new Date(),
        }
      });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        finalComments: `Admin Override: ${comments || ''}`
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

    res.json({
      message: `Expense ${action}d successfully (Admin Override)`,
      expense: updatedExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/approval/history
// @desc    Get approval history for all expenses
// @access  Private (Manager, Admin)
router.get('/history', protect, authorize('MANAGER', 'ADMIN'), async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role === 'MANAGER') {
      whereClause.approvalSteps = {
        some: {
          approverId: req.user.id
        }
      };
    } else if (req.user.role === 'ADMIN') {
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
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;