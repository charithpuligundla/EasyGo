import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWalletHistory } from '../controllers/walletController.js';

const router = express.Router();

router.get('/', protect, getWalletHistory);

export default router;
