import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMyFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';

const router = express.Router();

router.get('/', protect, getMyFavorites);
router.post('/:vehicleId', protect, addFavorite);
router.delete('/:vehicleId', protect, removeFavorite);

export default router;
