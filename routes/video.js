import express from 'express';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';
const router = express.Router();

router.get('/', videoController.getVideos);
router.post('/:pid/increment',videoController.incrementVideoViews)

// update likes
router.put('/:pid', validateToken, videoController.updateVideoLikes);

export default router;
