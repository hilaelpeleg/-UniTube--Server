import videoController from '../controllers/video.js';
import express from 'express';
const router = express.Router();

router.get('/', videoController.getVideos);

export default router;
