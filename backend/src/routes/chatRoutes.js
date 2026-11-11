import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserChats, getOrCreateChat, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', protect, getUserChats);
router.get('/booking/:bookingId', protect, getOrCreateChat);
router.post('/booking/:bookingId/messages', protect, sendMessage);

export default router;
