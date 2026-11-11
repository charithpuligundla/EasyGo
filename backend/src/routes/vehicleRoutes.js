import express from 'express';
import { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', protect, upload.array('vehicleImages', 10), createVehicle);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, deleteVehicle);

export default router;
