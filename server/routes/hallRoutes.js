import express from 'express';
import {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
} from '../controllers/hallController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllHalls); 
router.get('/:id', getHallById); 

router.post('/', authenticateToken, createHall); 
router.put('/:id', authenticateToken, updateHall); 
router.delete('/:id', authenticateToken, deleteHall);

export default router;
