import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAdminStats,
  getAllBookings,
  getAllUsers,
  getAllVehicles,
  deleteVehicleAdmin,
  getAllOrganizations,
  verifyOrganization,
  getPendingOrganizations,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.get('/vehicles', getAllVehicles);
router.delete('/vehicles/:id', deleteVehicleAdmin);
router.get('/organizations', getAllOrganizations);
router.get('/organizations/pending', getPendingOrganizations);
router.put('/organizations/:id/verify', verifyOrganization);

export default router;
