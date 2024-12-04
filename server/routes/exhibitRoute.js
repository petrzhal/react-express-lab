import express from 'express';
import {
  getAllExhibits,
  getExhibitById,
  createExhibit,
  updateExhibit,
  deleteExhibit,
} from '../controllers/exhibitController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllExhibits); 
router.get('/:id', getExhibitById);

router.post('/', authenticateToken, createExhibit); 
router.put('/:id', authenticateToken, updateExhibit); 
router.delete('/:id', authenticateToken, deleteExhibit); 

export default router;
