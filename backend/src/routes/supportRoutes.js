import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMyTickets, createTicket } from '../controllers/supportController.js';

const router = express.Router();

router.get('/', protect, getMyTickets);
router.post('/', protect, createTicket);

export default router;
