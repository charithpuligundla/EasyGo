import express from 'express';
import { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

router.get('/owner', protect, getOwnerBookings);

router.route('/:id')
  .put(protect, updateBookingStatus);

export default router;
