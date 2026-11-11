import express from 'express';
import { createOrganization, getMyOrganizations } from '../controllers/orgController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrganization);
router.get('/my', protect, getMyOrganizations);

export default router;
