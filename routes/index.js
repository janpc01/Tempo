import express from 'express';
import authController from '../controllers/authController.js';
import dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Home Route
router.get('/', authController.getHome);

// Login Route
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register Route
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Dashboard Route
router.get('/dashboard', authController.ensureAuthenticated, dashboardController.getDashboard);

// Logout Route
router.get('/logout', authController.getLogout);

export default router;
