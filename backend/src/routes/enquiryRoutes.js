import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';

const router = express.Router();

// Public route for submissions
router.post('/', createEnquiry);

// Admin routes (should ideally have auth middleware, but keeping it simple for now as requested)
router.get('/', getEnquiries);
router.put('/:id', updateEnquiryStatus);
router.delete('/:id', deleteEnquiry);

export default router;
