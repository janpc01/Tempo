import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Login Route
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register Route
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Home Route
router.get('/home', authController.ensureAuthenticated, authController.getHome);

export default router;
