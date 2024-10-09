import express from 'express';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';
const router = express.Router();

router.get('/', videoController.getVideos);
router.get('/highest-id', videoController.getHighestVideoId);

router.post('/:pid/increment',videoController.incrementVideoViews);
router.put('/:pid', videoController.updateVideoDuration);


// update likes
router.put('/:pid', validateToken, videoController.updateVideoLikes);


router.post('/:videoId/like', videoController.toggleLike);
router.post('/:videoId/dislike', videoController.toggleDislike);

export default router;