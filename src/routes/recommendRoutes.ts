import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { recommendProperty, getReceivedRecommendations } from '../controllers/recommendController';
const router = express.Router();
router.post('/', protect, recommendProperty);
router.get('/received', protect, getReceivedRecommendations);
export default router;