import express from 'express';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';
const router = express.Router();

router.get('/', videoController.getVideos);
console.log ('polo');

// update likes
router.put('/:pid', validateToken, videoController.updateVideoLikes);

export default router;
