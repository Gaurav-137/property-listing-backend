import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController';
const router = express.Router();
router.post('/', protect, addFavorite);
router.get('/', protect, getFavorites);
router.delete('/:id', protect, removeFavorite);
export default router;