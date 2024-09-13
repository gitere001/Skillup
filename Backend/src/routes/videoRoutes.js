import express from 'express';
import { createVideo, getPurchasedVideos } from '../controllers/videoController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Route to create a new video (Instructor only)
router.post('/create', authMiddleware, createVideo);

// Route to get purchased videos
router.get('/purchased', authMiddleware, getPurchasedVideos);

export default router;
