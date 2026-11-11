import express from 'express';
import { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const handleVehicleUpload = (req, res, next) => {
  upload.array('vehicleImages', 10)(req, res, (err) => {
    if (err) {
      console.error('Vehicle image upload error:', err);
      return res.status(400).json({ message: typeof err === 'string' ? err : err.message || 'File upload error' });
    }
    next();
  });
};

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', protect, handleVehicleUpload, createVehicle);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, deleteVehicle);

export default router;
