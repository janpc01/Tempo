import express from 'express';
import authController from '../controllers/authController.js';
import homeController from '../controllers/homeController.js';
import dashboardController from '../controllers/dashboardController.js';
import habitController from '../controllers/habitController.js';

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
router.get('/:username', authController.ensureAuthenticated, homeController.getHome);

// Dashboard Route
router.get('/:username/:dashboard', authController.ensureAuthenticated, dashboardController.getDashboard);

// Create/Edit/Delete Dashboard Routes
router.get('/:username/dashboard/new', authController.ensureAuthenticated, dashboardController.getAddDashboard);
router.post('/:username/dashboard/new', authController.ensureAuthenticated, dashboardController.postAddDashboard);
router.get('/:username/:dashboard/edit', authController.ensureAuthenticated, dashboardController.getEditDashboard);
router.post('/:username/:dashboard/edit', authController.ensureAuthenticated, dashboardController.postEditDashboard);
router.post('/:username/:dashboard_id/delete', authController.ensureAuthenticated, dashboardController.postDeleteDashboard);

// Habit Route
router.get('/:username/:dashboard/:habit', authController.ensureAuthenticated, habitController.getHabit);

// Create/Edit/Delete Habit Routes
router.get('/:username/:dashboard/habit/new', authController.ensureAuthenticated, habitController.getAddHabit);
router.post('/:username/:dashboard/habit/new', authController.ensureAuthenticated, habitController.postAddHabit);
router.get('/:username/:dashboard/:habit/edit', authController.ensureAuthenticated, habitController.getEditHabit);
router.post('/:username/:dashboard/:habit/edit', authController.ensureAuthenticated, habitController.postEditHabit);
router.post('/:username/:dashboard/:habit_id/delete', authController.ensureAuthenticated, habitController.postDeleteHabit);

export default router;
