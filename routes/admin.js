/*
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
*/

import express from 'express';
import adminController from '../controllers/admincontroller.js';

const router = express.Router();

// Redirect /admin to /admin/dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// Auth middleware for admin routes - check both authentication and admin role
const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session.userId) return res.redirect('/login');
    
    // Import User model
    const { User } = await import('../models/index.js');
    const user = await User.findByPk(req.session.userId);
    
    if (!user) return res.redirect('/login');
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.redirect('/login');
  }
};

// Admin routes - protected
router.get('/dashboard', authMiddleware, adminController.getDashboard);
router.get('/analytics', authMiddleware, adminController.getAnalytics);
router.get('/users', authMiddleware, adminController.getUsers);
router.get('/users/:id', authMiddleware, adminController.getUserDetail);

// Admin action routes
router.post('/users/reset-password', authMiddleware, adminController.resetUserPassword);
router.post('/users/ban', authMiddleware, adminController.banUser);
router.post('/users/remove-admin', authMiddleware, adminController.removeAdmin);
router.post('/users/make-admin', authMiddleware, adminController.makeAdmin);

// Report and logs routes
router.post('/reports/generate', authMiddleware, adminController.generateReport);
router.get('/logs', authMiddleware, adminController.getActivityLogs);

export default router;
