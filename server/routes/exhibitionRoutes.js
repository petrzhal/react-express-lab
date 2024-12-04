import express from 'express';
import {
  getAllExhibitions,
  getExhibitionById,
  createExhibition,
  updateExhibition,
  deleteExhibition,
} from '../controllers/exhibitionController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllExhibitions);
router.get('/:id', getExhibitionById); 

router.post('/', authenticateToken, createExhibition); 
router.put('/:id', authenticateToken, updateExhibition); 
router.delete('/:id', authenticateToken, deleteExhibition); 

export default router;
