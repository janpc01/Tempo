import express from 'express';
import authController from '../controllers/authController.js';
import dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Root Route
router.get('/', authController.getRoot);

// Login Route
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register Route
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Logout Route
router.get('/logout', authController.getLogout);

// Home Route
router.get('/:username', authController.ensureAuthenticated, dashboardController.getHome);

// Dashboard Route
router.get('/:username/:dashboard', authController.ensureAuthenticated, dashboardController.getDashboard);

// Habit Route
router.get('/:username/:dashboard/:habit', authController.ensureAuthenticated, dashboardController.getHabit);

export default router;
