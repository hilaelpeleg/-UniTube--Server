import express from 'express';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';
const router = express.Router();

// Route to get all videos
router.get('/', videoController.getVideos);

// Route to get the video with the highest ID
router.get('/highest-id', videoController.getHighestVideoId);

// Route to increment video views by video ID
router.post('/:pid/increment',videoController.incrementVideoViews);

// Route to update the video duration by video ID
router.put('/:pid', videoController.updateVideoDuration);

// Route to update likes on a video, requires token validation
router.put('/:pid/like', validateToken, videoController.updateVideoLikes);

// Route to toggle like on a video by video ID
router.post('/:videoId/like', videoController.toggleLike);

// Route to toggle dislike on a video by video ID
router.post('/:videoId/dislike', videoController.toggleDislike);

export default router;