import express from 'express';
import { register, login, getUserProfile, logout, refreshToken, logoutAllDevices } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => res.json({ message: 'Admin access granted' }));
router.post('/logout-all', authMiddleware, logoutAllDevices);

export default router;
