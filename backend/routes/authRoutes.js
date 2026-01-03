import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import verifyToken from '../middleware/authMiddleware.js';

// Native Auth Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Route to verify login from frontend (Firebase)
router.post('/verify-login', verifyToken, authController.verifyLogin);



// Protected route example
router.get('/protected', verifyToken, authController.protectedRoute);

export default router;
