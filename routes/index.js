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

// Logout Route
router.get('/logout', authController.getLogout);

// Dashboard Route
router.get('/:username', authController.ensureAuthenticated, dashboardController.getDashboards);


export default router;
